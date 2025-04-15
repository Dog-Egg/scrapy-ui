"use client";

import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { DataTable } from "./data-table";
import type {
  FinishedJob,
  PendingJob,
  RunningJob,
} from "@/actions/scrapyd-api";
import { cancel, viewItems, viewLog } from "@/client/scrapyd-api";
import { listjobs } from "@/client/scrapyd-api";
import { Poller } from "@/lib/poller";
import { useCurrentNode } from "./node-provider";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Column } from "@tanstack/react-table";
import Input from "./Input";
import { getHighlightedText } from "@/lib/jsx-helper";
import Button from "./shorts/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScheduleFormDialog } from "./schedule-form-dialog";
import {
  DotsHorizontalIcon,
  CaretSortIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { isEqual } from "lodash";
import {
  StopwatchIcon,
  CheckCircledIcon,
  LapTimerIcon,
} from "@radix-ui/react-icons";
import calendar from "dayjs/plugin/calendar";
import { useToast } from "./ui/use-toast";
import { Timer } from "./timer";
import { FileViewer, FileViewerProps } from "./file-viewer";
import { useScheduleFormDialog } from "@/stores";
import { getJob } from "@/actions/db";

dayjs.extend(utc);
dayjs.extend(calendar);

type TablePendingJob = PendingJob & {
  stage: "pending";
};
type TableRunningJob = RunningJob & {
  stage: "running";
};
type TableFinishedJob = FinishedJob & {
  stage: "finished";
};

type Job = TablePendingJob | TableRunningJob | TableFinishedJob;

const datetimeFormatter = "YYYY-MM-DD HH:mm:ss";

export default function JobTable() {
  const currentNode = useCurrentNode();

  // search
  const [searchValue, setSearchValue] = useState("");
  function filterTableData<T extends RunningJob | FinishedJob | PendingJob>(
    data: T[],
  ) {
    if (!searchValue) return data;
    return data.filter((item) => {
      if (
        item.id.includes(searchValue) ||
        item.project.includes(searchValue) ||
        item.spider.includes(searchValue)
      ) {
        return item;
      }
    });
  }

  const { toast } = useToast();
  const { setOpenDialog, setInitFormValues } = useScheduleFormDialog();

  const columns: ColumnDef<Job>[] = useMemo(() => {
    return [
      // {
      //   header: "JobID",
      //   cell({ row }) {
      //     return getHighlightedText(row.original.id, searchValue);
      //   },
      // },
      {
        accessorKey: "project",
        header: "项目",
        cell({ row }) {
          return getHighlightedText(row.original.project, searchValue);
        },
      },
      {
        accessorKey: "spider",
        header: "爬虫",
        cell({ row }) {
          return getHighlightedText(row.original.spider, searchValue);
        },
      },
      {
        header: "状态",
        cell({ row }) {
          let Icon;
          let titleText = "";
          switch (row.original.stage) {
            case "pending":
              Icon = StopwatchIcon;
              titleText = "等待中";
              break;
            case "running":
              Icon = LapTimerIcon;
              titleText = "运行中";
              break;
            case "finished":
              Icon = CheckCircledIcon;
              titleText = "已完成";
              break;
          }

          return (
            <span className="flex items-center">
              <Icon className="mr-2 h-4 w-4" />
              {titleText}
            </span>
          );
        },
      },
      {
        accessorKey: "start_time",
        id: "startTime",
        cell({ row }) {
          const stage = row.original.stage;
          if (stage === "finished" || stage === "running")
            return dayjs.utc(row.original.start_time).local().calendar();
        },
        header: ({ column }) => {
          return <SortHeader title="开始时间" column={column} />;
        },
      },
      {
        accessorKey: "end_time",
        header: ({ column }) => {
          return <SortHeader title="结束时间" column={column} />;
        },
        cell({ row }) {
          if (row.original.stage === "finished")
            return dayjs.utc(row.original.end_time).local().calendar();
        },
      },
      {
        id: "elapsed",
        header({ column }) {
          return "耗时";
        },
        cell({ row }) {
          const { stage } = row.original;
          if (stage === "pending") return;
          return (
            <Timer
              startTime={row.original.start_time}
              endTime={stage === "finished" ? row.original.end_time : undefined}
            />
          );
        },
      },
      {
        id: "actions",
        cell({ row }) {
          const { stage } = row.original;

          let log_url: string | undefined;
          let items_url: string | undefined;
          if (stage === "running" || stage === "finished") {
            log_url = row.original.log_url;
            items_url = row.original.items_url;
          }

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">打开菜单</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                {(row.original.stage == "pending" ||
                  row.original.stage == "running") && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        const { project, id } = row.original;
                        if (currentNode) {
                          cancel(currentNode?.url, project, id).then(
                            ({ prevstate }) => {
                              toast({
                                title: "任务已成功取消。",
                                description: `先前状态: "${prevstate}"`,
                              });
                            },
                          );
                        }
                      }}
                    >
                      取消任务
                    </DropdownMenuItem>
                  </>
                )}
                {log_url && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (currentNode && log_url) {
                        viewLog(currentNode?.url, log_url).then((content) =>
                          fileViewerDispath({
                            type: "open",
                            title: "日志",
                            content,
                            showRefreshButton: stage === "running",
                            refreshFunction() {
                              if (log_url) {
                                return viewLog(currentNode.url, log_url);
                              } else {
                                return Promise.reject("no log_url");
                              }
                            },
                          }),
                        );
                      }
                    }}
                  >
                    查看日志
                  </DropdownMenuItem>
                )}
                {items_url && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (currentNode && items_url) {
                        viewItems(currentNode?.url, items_url).then(
                          (content) => {
                            fileViewerDispath({
                              type: "open",
                              title: "结果项",
                              content,
                              showRefreshButton: stage === "running",
                              refreshFunction() {
                                if (items_url) {
                                  return viewItems(currentNode.url, items_url);
                                } else {
                                  return Promise.reject("no items_url");
                                }
                              },
                            });
                          },
                        );
                      }
                    }}
                  >
                    查看结果项
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    currentNode &&
                      getJob(currentNode.id, row.original.id).then((data) => {
                        if (data) {
                          setInitFormValues(data.args.data);
                          setOpenDialog(true, "copying");
                        } else {
                          toast({
                            title: "无法获取任务详情",
                            variant: "destructive",
                          });
                        }
                      });
                  }}
                >
                  重新调度任务
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [searchValue, currentNode, toast, setOpenDialog, setInitFormValues]);

  // tables
  const [tableData, setTableData] = useState<Job[]>([]);
  const fetchTableDatas = useCallback(
    function () {
      if (currentNode)
        listjobs(currentNode?.url).then((data) => {
          const formatedData: Job[] = [];
          data.running.forEach((item) => {
            formatedData.push({
              ...item,
              stage: "running",
            });
          });
          data.pending.forEach((item) => {
            formatedData.push({
              ...item,
              stage: "pending",
            });
          });
          data.finished.forEach((item) => {
            formatedData.push({
              ...item,
              stage: "finished",
            });
          });

          setTableData((old) =>
            isEqual(old, formatedData) ? old : formatedData,
          );
        });
    },
    [currentNode],
  );
  useEffect(() => {
    const poller = new Poller(fetchTableDatas, { interval: 5000 });
    poller.start();
    return () => {
      poller.stop();
    };
  }, [fetchTableDatas]);

  // log & items viewer
  const refreshFunction = useRef<() => Promise<string>>();
  const reducer = useCallback<
    Reducer<
      FileViewerProps,
      | {
          type: "open";
          title: string;
          content: string;
          showRefreshButton: boolean;
          refreshFunction: () => Promise<string>;
        }
      | { type: "close" }
      | { type: "refresh" }
      | { type: "resolveRefresh"; content: string }
    >
  >(function (states, action): FileViewerProps {
    switch (action.type) {
      case "open":
        refreshFunction.current = action.refreshFunction;
        return { ...states, open: true, ...action };
      case "close":
        return { ...states, open: false };
      case "refresh":
        refreshFunction.current?.().then((content) => {
          fileViewerDispath({ type: "resolveRefresh", content });
        });
        return { ...states, refreshLoading: true };
      case "resolveRefresh":
        return { ...states, refreshLoading: false, content: action.content };
    }
  }, []);
  const [fileViewerStates, fileViewerDispath] = useReducer(reducer, {
    title: "",
    content: "",
    open: false,
    showRefreshButton: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-4">
        <Input
          className="w-[15rem]"
          placeholder="Filter jobs..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button
          onClick={() => {
            setOpenDialog(true, "creation");
          }}
        >
          创建任务
        </Button>
      </div>
      <DataTable
        data={filterTableData(tableData || [])}
        columns={columns}
        initialSortingState={[{ id: "startTime", desc: true }]}
      />
      <FileViewer
        {...fileViewerStates}
        onOpenChange={() => fileViewerDispath({ type: "close" })}
        onRefresh={() => {
          fileViewerDispath({ type: "refresh" });
        }}
      />
      <ScheduleFormDialog />
    </div>
  );
}

function SortHeader<TData>({
  column,
  title,
}: {
  column: Column<TData>;
  title: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      <span className="ml-2 *:h-4 *:w-4">
        {!sorted ? (
          <CaretSortIcon />
        ) : sorted == "asc" ? (
          <ArrowUpIcon />
        ) : (
          <ArrowDownIcon />
        )}
      </span>
    </Button>
  );
}

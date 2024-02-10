"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  FileContentViewer,
  FileContentViewerHandle,
} from "./file-content-viewer";

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
        header: "Project",
        cell({ row }) {
          return getHighlightedText(row.original.project, searchValue);
        },
      },
      {
        accessorKey: "spider",
        header: "Spider",
        cell({ row }) {
          return getHighlightedText(row.original.spider, searchValue);
        },
      },
      {
        header: "Stage",
        cell({ row }) {
          let Icon;
          switch (row.original.stage) {
            case "pending":
              Icon = StopwatchIcon;
              break;
            case "running":
              Icon = LapTimerIcon;
              break;
            case "finished":
              Icon = CheckCircledIcon;
              break;
          }

          const title = row.original.stage;
          return (
            <span className="flex items-center">
              <Icon className="mr-2 h-4 w-4" />
              {title.charAt(0).toUpperCase() + title.substr(1).toLowerCase()}
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
          return <SortHeader title="StartTime" column={column} />;
        },
      },
      {
        accessorKey: "end_time",
        header: ({ column }) => {
          return <SortHeader title="EndTime" column={column} />;
        },
        cell({ row }) {
          if (row.original.stage === "finished")
            return dayjs.utc(row.original.end_time).local().calendar();
        },
      },
      {
        id: "elapsed",
        header({ column }) {
          return "Elapsed";
        },
        cell({ row }) {
          const { stage } = row.original;
          if (stage === "pending") return;
          return (
            <Timer
              // className="ml-5"
              startTime={row.original.start_time}
              endTime={stage === "finished" ? row.original.end_time : undefined}
            />
          );
        },
      },
      {
        id: "actions",
        cell({ row }) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                                title: "The job was successfully cancelled.",
                                description: `prevstate: "${prevstate}"`,
                              });
                            },
                          );
                        }
                      }}
                    >
                      Cancel Job
                    </DropdownMenuItem>
                  </>
                )}
                {row.original.stage === "finished" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        if (row.original.stage === "finished" && currentNode) {
                          viewLog(currentNode?.url, row.original.log_url).then(
                            (content) =>
                              fileContentViewerRef.current?.render({
                                title: "Log",
                                content: content,
                              }),
                          );
                        }
                      }}
                    >
                      View Log
                    </DropdownMenuItem>
                    {row.original.items_url && (
                      <DropdownMenuItem
                        onClick={() => {
                          if (
                            row.original.stage === "finished" &&
                            row.original.items_url &&
                            currentNode
                          ) {
                            viewItems(
                              currentNode?.url,
                              row.original.items_url,
                            ).then((content) => {
                              fileContentViewerRef.current?.render({
                                title: "Items",
                                content,
                              });
                            });
                          }
                        }}
                      >
                        View Items
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [searchValue, currentNode, toast]);

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

  const fileContentViewerRef = useRef<FileContentViewerHandle>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between space-x-4">
        <Input
          className="w-[15rem]"
          placeholder="Filter jobs..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <ScheduleFormDialog>
          <Button>Create a Job</Button>
        </ScheduleFormDialog>
      </div>
      <DataTable
        data={filterTableData(tableData || [])}
        columns={columns}
        initialSortingState={[{ id: "startTime", desc: true }]}
      />
      <FileContentViewer ref={fileContentViewerRef} />
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

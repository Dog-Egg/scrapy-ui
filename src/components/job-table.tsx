"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "./data-table";
import { FinishedJob, PendingJob, RunningJob, listjobs } from "@/actions";
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
          if (row.original.stage !== "finished") return;
          const seconds =
            dayjs(row.original.end_time).diff(dayjs(row.original.start_time)) /
            1000;
          const units: [string, number][] = [
            ["h", 60 * 60],
            ["m", 60],
            ["s", 1],
          ];
          const parts = [];
          let t = seconds;
          for (const [unit, n] of units) {
            if (t > n) {
              const floor = Math.floor(t / n);
              parts.push(floor + unit);
              t -= floor * n;
            }
          }
          return <span className="ml-5">{parts.join(" ")}</span>;
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
                {row.original.stage === "finished" && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (row.original.stage === "finished")
                        window.open(
                          new URL(row.original.log_url, currentNode?.url),
                        );
                    }}
                  >
                    View Log
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [searchValue, currentNode]);

  // tables
  const [tableData, setTableData] = useState<Job[]>([]);
  const fetchTableDatas = useCallback(
    function () {
      if (currentNode)
        listjobs(currentNode?.url).then((res) => {
          if (!res.ok) {
            // TODO show error
            return;
          }

          const data = res.data;
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
    const poller = new Poller(fetchTableDatas, { interval: 1500 });
    poller.start();
    return () => {
      poller.stop();
    };
  }, [fetchTableDatas]);

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

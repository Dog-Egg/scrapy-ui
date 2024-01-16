"use client";
import Input from "@/components/Input";
import Table from "@/components/Table";
import dayjs from "dayjs";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Fragment, useMemo, useState } from "react";
import classNames from "classnames";

export default function JobsPage() {
  const tableData = [
    {
      id: "2f16646cfcaf11e1b0090800272a6d06",
      project: "myproject",
      spider: "spider3",
      start_time: "2012-09-12 10:14:03.594664",
      end_time: "2012-09-12 10:24:03.594664",
      log_url: "/logs/myproject/spider3/2f16646cfcaf11e1b0090800272a6d06.log",
      items_url: "/items/myproject/spider3/2f16646cfcaf11e1b0090800272a6d06.jl",
      stage: "finished",
    },
    {
      id: "422e608f9f28cef127b3d5ef93fe9399",
      project: "myproject",
      spider: "spider2",
      start_time: "2012-09-12 10:14:03.594664",
      stage: "running",
    },
    {
      project: "myproject",
      spider: "spider1",
      id: "78391cc0fcaf11e1b0090800272a6d06",
      stage: "pending",
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  const filteredTableData = useMemo(() => {
    if (!searchValue) return tableData;
    return tableData.filter((item) => {
      if (
        item.id.includes(searchValue) ||
        item.project.includes(searchValue) ||
        item.spider.includes(searchValue)
      ) {
        return item;
      }
    });
  }, [searchValue]);

  return (
    <div className="mt-10">
      <div className="mb-4 rounded-xl border border-secondary p-4">
        <div className=" w-1/5">
          <Input
            suffixIcon={<MagnifyingGlassIcon />}
            onChange={(value) => {
              setSearchValue(value);
            }}
          />
        </div>
      </div>
      <Table
        className="w-full"
        data={filteredTableData}
        columns={[
          {
            label: "JobID",
            render(row) {
              return getHighlightedText(row.id, searchValue);
            },
          },
          {
            label: "Project",
            render(row) {
              return getHighlightedText(row.project, searchValue);
            },
          },
          {
            label: "Spider",
            render(row) {
              return getHighlightedText(row.spider, searchValue);
            },
          },
          { label: "Stage", prop: "stage" },
          {
            label: "StartTime",
            render(row) {
              return (
                row.start_time &&
                dayjs(row.start_time).format("YYYY-MM-DD HH:mm:ss")
              );
            },
          },
          {
            label: "EndTime",
            render(row) {
              return (
                row.end_time &&
                dayjs(row.end_time).format("YYYY-MM-DD HH:mm:ss")
              );
            },
          },
        ]}
      />
    </div>
  );
}

function getHighlightedText(text: string, highlight: string) {
  if (!highlight) return text;

  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts
        .filter((i) => !!i)
        .map((part, index) => {
          if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
              <span
                key={index}
                className="bg-annotations rounded-sm text-white"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
    </>
  );
}

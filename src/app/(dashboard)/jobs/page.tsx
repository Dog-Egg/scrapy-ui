"use client";
import Table from "@/components/Table";

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
  return (
    <Table
      data={tableData}
      columns={[
        { label: "JobID", prop: "id" },
        { label: "Stage", prop: "stage" },
      ]}
    ></Table>
  );
}

import Button from "@/components/Button";
import Table from "@/components/Table";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Demo: Story = {
  args: {
    data: [
      {
        id: "2f16646cfcaf11e1b0090800272a6d06",
        project: "myproject",
        spider: "spider3",
        start_time: "2012-09-12 10:14:03.594664",
        end_time: "2012-09-12 10:24:03.594664",
        log_url: "/logs/myproject/spider3/2f16646cfcaf11e1b0090800272a6d06.log",
        items_url:
          "/items/myproject/spider3/2f16646cfcaf11e1b0090800272a6d06.jl",
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
    ],
    columns: [
      { label: "JobID", prop: "id" },
      { label: "Project", prop: "project" },
      { label: "Spider", prop: "spider" },
      { label: "Stage", prop: "stage" },
      { label: "StartTime", prop: "start_time" },
      { label: "EndTime", prop: "end_time" },
      {
        label: "Actions",
        render(row) {
          switch (row.stage) {
            case "running":
              return <Button pill>Cancel</Button>;
            case "pending":
              return <Button pill>Cancel</Button>;
            case "finished":
              return (
                <Button pill type="outline">
                  Log
                </Button>
              );
          }
        },
      },
    ],
  },
};

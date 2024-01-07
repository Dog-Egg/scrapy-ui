import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Demo: Story = {
  args: {
    menu: [{ label: "西红柿鸡蛋" }, { label: "红烧狮子头" }],
    children: <Button>Click Me!</Button>,
  },
};

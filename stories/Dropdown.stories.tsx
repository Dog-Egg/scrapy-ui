import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { Meta, StoryObj } from "@storybook/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Demo: Story = {
  args: {
    menu: [
      { label: "西红柿鸡蛋" },
      { label: "红烧狮子头" },
      { label: "粉蒸肉" },
    ],
    children: <Button>Click Me!</Button>,
  },
};

export const Icon: Story = {
  args: {
    children: <Button>Click Me!</Button>,
    menu: [{ label: "Settings", icon: <Cog6ToothIcon /> }],
  },
};

export const onSelect: Story = {
  args: {
    ...Demo.args,
    menu: [
      { label: "A", key: "a" },
      { label: "B", key: "b" },
      { label: "C", key: "c" },
    ],
  },
  name: "onSelect",
};

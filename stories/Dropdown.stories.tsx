import Button from "@/components/shorts/button";
import Dropdown from "@/components/shorts/dropdown";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Demo: Story = {
  args: {
    menu: [{ label: "Light" }, { label: "Dark" }, { label: "System" }],
    children: <Button>Click Me!</Button>,
  },
};

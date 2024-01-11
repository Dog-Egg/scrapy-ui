import Select from "@/components/Select";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Select> = {
  component: Select,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Demo: Story = {
  args: {
    placeholder: "Select",
    options: [
      { label: "label 1", value: 0 },
      { label: "label 2", value: 1 },
    ],
  },
};

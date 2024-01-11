import Input from "@/components/Input";
import { Meta, StoryObj } from "@storybook/react";
import { EyeIcon } from "@heroicons/react/24/outline";

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Demo = {};

export const Icon: Story = {
  args: {
    suffixIcon: <EyeIcon />,
  },
};

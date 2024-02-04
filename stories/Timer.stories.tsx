import { Timer } from "@/components/timer";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Timer> = {
  component: Timer,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Timer>;

export const Static: Story = {
  args: {
    startTime: "2012-09-12 10:14:03.594664",
    endTime: "2012-09-12 10:24:03.594664",
  },
};

export const Dynamic: Story = {
  args: {
    startTime: "2012-09-12 10:14:03.594664",
  },
};

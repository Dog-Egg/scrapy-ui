import type { Meta, StoryObj } from "@storybook/react";
import { PlusCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import Button from "../src/components/Button";

const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    children: "Button",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Type: Story = {
  render(args) {
    return (
      <div>
        <Button {...args} type="primary"></Button>
        <Button {...args} type="tertiary"></Button>
      </div>
    );
  },
};

export const Icon: Story = {
  args: {
    icon: <PlusCircleIcon />,
  },
};

export const SuffixIcon: Story = {
  args: {
    suffixIcon: <CheckIcon />,
  },
};

/**
 * 按钮宽度设为 100%
 */
export const Block: Story = {
  render() {
    return (
      <div style={{ width: "500px" }}>
        <Button block>Button</Button>
      </div>
    );
  },
};

export const Disable: Story = {
  args: {
    disabled: true,
  },
  render(args) {
    return (
      <div>
        <Button {...args}></Button>
      </div>
    );
  },
};

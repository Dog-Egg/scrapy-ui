import type { Meta, StoryObj } from "@storybook/react";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import Button from "../src/components/shorts/button";

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

export const Variant: Story = {
  render(args) {
    return (
      <div>
        <Button {...args} variant="default"></Button>
        <Button {...args} variant="secondary"></Button>
        <Button {...args} variant="outline"></Button>
        <Button {...args} variant="dashed"></Button>
        <Button {...args} variant="destructive"></Button>
        <Button {...args} variant="ghost"></Button>
        <Button {...args} variant="link"></Button>
      </div>
    );
  },
};

export const Size: Story = {
  render(args) {
    return (
      <div className="flex items-center">
        <Button {...args} size="lg"></Button>
        <Button {...args} size="default"></Button>
        <Button {...args} size="sm"></Button>
        <Button {...args} size="icon" icon={<EnvelopeOpenIcon />}>
          {undefined}
        </Button>
      </div>
    );
  },
};

export const Icon: Story = {
  args: {
    icon: <EnvelopeOpenIcon />,
  },
};

export const Disable: Story = {
  ...Variant,
  args: {
    ...Variant.args,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="https://www.google.com">Google</a>,
  },
};

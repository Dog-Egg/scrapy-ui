import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { Meta, StoryObj } from "@storybook/react";
import { PlusIcon } from "@heroicons/react/24/outline";

const meta: Meta<typeof Form> = {
  component: Form,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Demo: Story = {
  render() {
    return (
      <Form>
        <Form.Item label="Node">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button>Save</Button>
        </Form.Item>
      </Form>
    );
  },
};

export const ChangeFormItem = {
  name: "Add/Remove Form Item",
  render() {
    return (
      <Form>
        <Form.Item label="settings">
          <Button type="dashed" block icon={<PlusIcon />}>
            Add setting
          </Button>
        </Form.Item>
        <Form.Item>
          <Input placeholder="DEPTH_LIMIT"></Input>
        </Form.Item>
      </Form>
    );
  },
};

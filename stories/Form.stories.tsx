import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Form",
  tags: ["autodocs"],
};

export default meta;

export const Demo = {
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
        <Form.Item label="s"></Form.Item>
      </Form>
    );
  },
};

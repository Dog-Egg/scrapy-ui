import Button from "@/components/shorts/button";
import { Meta } from "@storybook/react";
import * as Message from "@/components/shorts/message";

/**
 * 函数式调用的组件，Promise 风格，使用 Alert Dialog 封装。
 */
const meta: Meta = {
  title: "Message",
  tags: ["autodocs"],
};

export default meta;

export const Confirm = {
  render() {
    return (
      <Button
        onClick={() => {
          Message.confirm({ title: "Are you sure?" }).then(alert).catch(alert);
        }}
      >
        Show Message
      </Button>
    );
  },
};

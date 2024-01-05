import type { Meta, StoryObj } from "@storybook/react";
import Modal from "../src/components/Modal";
import Button from "../src/components/Button";

const meta: Meta<typeof Modal> = {
  component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Confirm: Story = {
  render() {
    return (
      <Button
        onClick={() => {
          Modal.confirm({
            title: "Delete confirmation",
            message: "Are you sure you want to delete 32 items?",
            confirmButtonText: "Delete",
          });
        }}
      >
        Show Modal
      </Button>
    );
  },
};

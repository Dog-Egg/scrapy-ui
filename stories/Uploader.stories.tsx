import { Meta, StoryObj } from "@storybook/react";
import { Uploader } from "@/components/uploader";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Uploader> = {
  component: Uploader,
};

export default meta;

type Story = StoryObj<typeof Uploader>;

export const Primary: Story = {};

function WithForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit((values) => {
        action("submit")(values);
      })}
      className="space-y-4"
    >
      <div>
        <label htmlFor="uploader">Upload:</label>
        <Uploader {...register("file", { required: true })} />
        {errors.file && <span>This field is required</span>}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export const Form: Story = {
  render() {
    return <WithForm />;
  },
};

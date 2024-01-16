import Select from "@/components/shorts/select";
import * as SelectUI from "@/components/ui/select";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PlusCircledIcon, PaperPlaneIcon } from "@radix-ui/react-icons";

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
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
  },
};

export const DefaultValue: Story = {
  args: {
    ...Demo.args,
    defaultValue: "banana",
  },
};

function SelectWithHook() {
  const [value, setValue] = useState<string>("");
  return (
    <SelectUI.Select
      value={value}
      onValueChange={(val) => {
        if (val !== "-") {
          setValue(val);
        }
      }}
    >
      <SelectUI.SelectTrigger>
        <div className="flex items-center">
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
          <SelectUI.SelectValue
            aria-label={value}
            placeholder="Select"
          ></SelectUI.SelectValue>
        </div>
      </SelectUI.SelectTrigger>
      <SelectUI.SelectContent>
        <SelectUI.SelectItem value="apple">Apple</SelectUI.SelectItem>
        <SelectUI.SelectItem value="banana">Banana</SelectUI.SelectItem>
        <SelectUI.SelectSeparator></SelectUI.SelectSeparator>
        <SelectUI.SelectItem value="-">
          <div className="flex items-center">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Create a fruit
          </div>
        </SelectUI.SelectItem>
      </SelectUI.SelectContent>
    </SelectUI.Select>
  );
}

export const ComplexItems: Story = {
  render() {
    return <SelectWithHook />;
  },
};

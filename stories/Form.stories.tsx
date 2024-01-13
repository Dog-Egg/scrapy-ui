import Button from "@/components/Button";
import Form from "@/components/Form";
import { required } from "@/components/Form/validators";
import Input from "@/components/Input";
import { Meta, StoryObj } from "@storybook/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Select from "@/components/Select";
import { XMarkIcon } from "@heroicons/react/24/solid";

const meta: Meta<typeof Form> = {
  component: Form,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Demo: Story = {
  render(args) {
    return (
      <Form {...args}>
        <Form.Item label="Node" prop="node">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button>Save</Button>
        </Form.Item>
      </Form>
    );
  },
};

export const ChangeFormField: Story = {
  name: "Add/Remove Field",
  render(args) {
    const settings = [
      "DEPTH_LIMIT",
      "DOWNLOAD_DELAY",
      "DOWNLOADER_STATS",
      "DOWNLOAD_TIMEOUT",
      "DOWNLOAD_MAXSIZE",
      "DUPEFILTER_CLASS",
      "LOG_LEVEL",
      // ...
    ];

    const [settingKeys, setSettingKeys] = useState<number[]>([]);

    function addSettingItem() {
      setSettingKeys([...settingKeys, Date.now()]);
    }

    function removeSettingItem(key: number) {
      setSettingKeys(settingKeys.filter((i) => i !== key));
    }

    return (
      <Form {...args} className="w-[500px]">
        {settingKeys.map((key, index) => (
          <div
            key={key}
            className="relative flex items-end *:ml-4 *:grow *:basis-0 first:*:ml-0"
          >
            <Form.Item
              label={settingKeys.length && index == 0 ? "Settings" : ""}
              prop={`settings.${index}.key`}
              validators={[required()]}
            >
              <Select
                options={settings.map((i) => ({ label: i, value: i }))}
                placeholder="Key"
              />
            </Form.Item>
            <Form.Item
              prop={`settings.${index}.value`}
              validators={[required()]}
            >
              <Input placeholder="Value" />
            </Form.Item>
            <XMarkIcon
              className="absolute -right-12 bottom-8 cursor-pointer"
              width={"2rem"}
              onClick={() => removeSettingItem(key)}
            />
          </div>
        ))}
        <Form.Item label={!settingKeys.length ? "Settings" : ""}>
          <Button
            type="dashed"
            block
            icon={<PlusIcon />}
            onClick={addSettingItem}
            htmlType="button"
          >
            Add setting
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    );
  },
};

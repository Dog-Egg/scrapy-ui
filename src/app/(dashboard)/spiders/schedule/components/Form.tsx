"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import { required } from "@/components/Form/validators";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const settings = [
  "DEPTH_LIMIT",
  "DOWNLOAD_DELAY",
  "DOWNLOAD_TIMEOUT",
  "DOWNLOAD_MAXSIZE",
  "LOG_LEVEL",
];

type Values = {
  settings?: { key: string; value: string }[];
  arguments?: { key: string; value: string }[];
  priority: number;
};

export default function SchedulingForm({
  onSubmit,
}: {
  onSubmit: (values: Values) => void;
}) {
  // settings
  const [settingKeys, setSettingKeys] = useState<number[]>([]);
  function addSettingItem() {
    setSettingKeys([...settingKeys, Date.now()]);
  }
  function removeSettingItem(key: number) {
    setSettingKeys(settingKeys.filter((i) => i !== key));
  }

  // arguments
  const [argumentKeys, setArgumentKeys] = useState<number[]>([]);
  function addArgumentItem() {
    setArgumentKeys([...argumentKeys, Date.now()]);
  }
  function removeArgumentItem(key: number) {
    setArgumentKeys(argumentKeys.filter((i) => i !== key));
  }

  function handleSubmit(values: Values) {
    onSubmit(values);
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {/* arguments */}
        {argumentKeys.map((key, index) => (
          <div
            key={key}
            className="relative flex items-end *:ml-4 *:grow *:basis-0 first:*:ml-0"
          >
            <Form.Item
              label={argumentKeys.length && index == 0 ? "Arguments" : ""}
              prop={`arguments.${index}.key`}
              validators={[required()]}
            >
              <Input placeholder="Key"></Input>
            </Form.Item>
            <Form.Item
              prop={`arguments.${index}.value`}
              validators={[required()]}
            >
              <Input placeholder="Value" />
            </Form.Item>
            <XMarkIcon
              className="absolute -right-12 bottom-8 cursor-pointer"
              width={"2rem"}
              onClick={() => removeArgumentItem(key)}
            />
          </div>
        ))}
        <Form.Item label={!argumentKeys.length ? "Arguments" : ""}>
          <Button
            type="dashed"
            block
            icon={<PlusIcon />}
            onClick={addArgumentItem}
            htmlType="button"
          >
            Add argument
          </Button>
        </Form.Item>
        {/* settings */}
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
        <Form.Item label="Priority" prop="priority">
          <Select
            defaultValue={0}
            options={[
              { label: "High", value: 10 },
              { label: "Medium", value: 0 },
              { label: "Low", value: -10 },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

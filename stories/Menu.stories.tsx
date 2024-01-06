import { Meta, StoryObj } from "@storybook/react";
import Menu from "@/components/Menu";
import {
  ListBulletIcon,
  CubeIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const meta: Meta<typeof Menu> = {
  component: Menu,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            border: "1px solid rgb(155, 165, 183)",
            borderRadius: "6px",
            minWidth: "200px",
          }}
        >
          <Story></Story>
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Demo: Story = {
  render() {
    return (
      <Menu>
        <Menu.Item label="Dashboard" />
        <Menu.Item label="List" />
      </Menu>
    );
  },
};

export const Icon: Story = {
  render() {
    return (
      <Menu>
        <Menu.Item label="Dashboard" icon={<CubeIcon />} />
        <Menu.Item label="List" icon={<ListBulletIcon />} />
      </Menu>
    );
  },
};

export const Active: Story = {
  render() {
    const items = [{ label: "Dashboard" }, { label: "List" }];
    const [activeKey, setActiveKey] = useState("Dashboard");

    return (
      <Menu>
        {items.map((item) => (
          <Menu.Item
            key={item.label}
            label={item.label}
            active={activeKey == item.label}
            onClick={() => setActiveKey(item.label)}
          />
        ))}
      </Menu>
    );
  },
};

export const Link: Story = {
  render() {
    return (
      <Menu>
        <Menu.Item label="Google" link="https://www.google.com" />
      </Menu>
    );
  },
};

export const CustomLabel: Story = {
  render() {
    return (
      <Menu>
        <Menu.Item
          label={
            <div>
              Dashboard
              <span style={{ color: "red" }}>[tag]</span>
            </div>
          }
        />
      </Menu>
    );
  },
};

export const SuffixIcon: Story = {
  render() {
    return (
      <Menu>
        <Menu.Item
          label="Other Icon"
          suffixIcon={<EllipsisVerticalIcon width="1.5em" />}
        />
        <Menu.Item label="List" suffixIcon={<ListBulletIcon />} />
        <Menu.Item label="Empty" suffixIcon={<></>} />
      </Menu>
    );
  },
};

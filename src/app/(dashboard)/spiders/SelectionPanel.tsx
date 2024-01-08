"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { ReactNode, useEffect, useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Dropdown from "@/components/Dropdown";
import Menu from "@/components/Menu";

interface Props<T> {
  title: string;
  options?: T[];
  onSelect?: (option: string) => void;
  emptyText?: string;
  selectable?: boolean;
  actions?: {
    label: string;
    icon?: ReactNode;
    onClick?: (option: T) => void;
  }[];
  defaultActive?: T;
}
export default function SelectionPanel({
  options,
  selectable = true,
  ...props
}: Props<string>) {
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setSelected(props.defaultActive);
  }, [options, props.defaultActive]);

  return (
    <div className="rounded-xl border border-secondary p-4">
      <h5 className="text-xl">{props.title}</h5>
      <div className="my-4 border-b border-dashed border-b-secondary"></div>
      <>
        {isEmpty(options) ? (
          <div className=" text-secondary">{props.emptyText}</div>
        ) : (
          <Menu>
            {options?.map((option) => (
              <Menu.Item
                key={option}
                label={option}
                active={option == selected}
                onClick={() => {
                  if (!selectable) return;
                  setSelected(option);
                  props.onSelect?.(option);
                }}
                suffixIcon={
                  props.actions ? (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Dropdown
                        onSelect={(index) => {
                          props.actions?.[index as number].onClick?.(option);
                        }}
                        menu={props.actions.map((item) => ({
                          label: item.label,
                          icon: item.icon,
                        }))}
                      >
                        <EllipsisVerticalIcon
                          className="cursor-pointer hover:text-primary"
                          width={"1.25em"}
                        />
                      </Dropdown>
                    </div>
                  ) : null
                }
              />
            ))}
          </Menu>
        )}
      </>
    </div>
  );
}

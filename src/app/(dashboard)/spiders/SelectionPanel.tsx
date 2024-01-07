"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { ReactNode, useEffect, useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Dropdown, { MenuProps } from "@/components/Dropdown";
import Menu from "@/components/Menu";

interface Props {
  title: string;
  options?: string[] | { label: ReactNode; value: string }[];
  onSelect?: (option: string) => void;
  emptyText?: string;
  selectable?: boolean;
  moreActions?: MenuProps;
  defaultActive?: string;
}
export default function SelectionPanel(props: Props) {
  const { selectable = true } = props;
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setSelected(props.defaultActive);
  }, [props.options, props.defaultActive]);

  const options = useMemo(() => {
    return props.options?.map((i) => {
      if (typeof i === "string") {
        return { label: i, value: i };
      }
      return i;
    });
  }, [props.options]);

  return (
    <div className="rounded-xl border border-secondary p-4">
      <h5 className="text-xl">{props.title}</h5>
      <div className="my-4 border-b border-dashed border-b-secondary"></div>
      <>
        {isEmpty(options) ? (
          <div className=" text-secondary">{props.emptyText}</div>
        ) : (
          <Menu>
            {options!.map((option) => (
              <Menu.Item
                key={option.value}
                label={option.label}
                active={option.value == selected}
                onClick={() => {
                  if (!selectable) return;
                  setSelected(option.value);
                  props.onSelect?.(option.value);
                }}
                suffixIcon={
                  props.moreActions ? (
                    <Dropdown menu={props.moreActions}>
                      <EllipsisVerticalIcon
                        className="cursor-pointer hover:text-primary"
                        width={"1.25em"}
                      />
                    </Dropdown>
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

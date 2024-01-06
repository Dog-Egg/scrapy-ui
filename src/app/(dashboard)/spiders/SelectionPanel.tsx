"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Dropdown, { MenuProps } from "@/components/Dropdown";
import Menu from "@/components/Menu";

interface Props {
  title: string;
  options?: string[];
  onSelect?: (option: string) => void;
  emptyText?: string;
  selectable?: boolean;
  moreActions?: MenuProps;
  defaultActive?: string;
}
export default function SelectionPanel(props: Props) {
  const { options, selectable = true } = props;
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    setSelected(props.defaultActive);
  }, [options, props.defaultActive]);

  return (
    <div className="rounded-xl border border-secondary p-4">
      <h5 className="text-xl">{props.title}</h5>
      <div className="my-4 border-b border-dashed border-b-secondary"></div>
      <>
        {isEmpty(props.options) ? (
          <div className=" text-secondary">{props.emptyText}</div>
        ) : (
          <Menu>
            {props.options!.map((option) => (
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

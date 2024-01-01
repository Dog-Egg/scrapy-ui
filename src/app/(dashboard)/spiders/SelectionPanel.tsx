"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Dropdown, { MenuProps } from "@/components/Dropdown";

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
          props.options?.map((option) => (
            <div
              key={option}
              className={classNames(
                "flex items-center justify-between rounded-lg px-2 py-4",
                selected === option && "bg-tertiary",
                selectable && "cursor-pointer",
              )}
              onClick={() => {
                if (!selectable) return;
                setSelected(option);
                props.onSelect?.(option);
              }}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {option}
              </span>

              {props.moreActions && (
                <Dropdown menu={props.moreActions}>
                  <EllipsisVerticalIcon
                    className="cursor-pointer hover:text-primary"
                    width={"1.25em"}
                  />
                </Dropdown>
              )}
            </div>
          ))
        )}
      </>
    </div>
  );
}

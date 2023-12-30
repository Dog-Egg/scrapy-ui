"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Dropdown, { MenuProps } from "@/components/Dropdown";

interface Props {
  title: string;
  options?: string[];
  onSelect?: (option: string | undefined) => void;
  emptyText?: string;
  selectable?: boolean;
  moreActions?: MenuProps;
}
export default function SelectionPanel(props: Props) {
  const { onSelect, options, selectable = true } = props;
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    // 当选择项列表更新时，清除以选择项
    if (selected) {
      setSelected(undefined);
      onSelect?.(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <div className="rounded-xl border border-secondary p-4">
      <h5 className="text-xl">{props.title}</h5>
      <div className="my-4 border-b border-dashed border-b-secondary"></div>
      <div>
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
                onSelect?.(option);
              }}
            >
              <span>{option}</span>

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
      </div>
    </div>
  );
}

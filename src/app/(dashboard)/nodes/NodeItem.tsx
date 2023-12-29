"use client";

import Loading from "@/components/Loading";
import { request } from "@/utils/request";
import { useEffect, useMemo, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

function NodeItem({ nodeURL }: { nodeURL: string }) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<ScrayUI.ScrapydDaemonstatusResponse>();

  useEffect(() => {
    setLoading(true);
    request({
      url: "/api/scrapyd/daemonstatus.json",
      method: "post",
      data: { url: nodeURL },
    }).then((resp) => {
      resp
        .json()
        .then((data) => {
          if (resp.ok) {
            setData(data);
          } else {
            setErrorMessage(data.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [nodeURL]);

  const statList = useMemo(() => {
    return [
      { label: "running", value: data?.running },
      { label: "pending", value: data?.pending },
      { label: "finished", value: data?.finished },
    ];
  }, [data]);

  return (
    <div className="group mx-auto mt-8 w-1/2 rounded-xl border border-[transparent] bg-tertiary p-4 hover:border-secondary">
      <div className="flex justify-between text-base text-secondary">
        <span>{useMemo(() => new URL(nodeURL).host, [nodeURL])}</span>
        {/* {data && <span className="ml-1">{`(${data.node_name})`}</span>} */}
        <span className="hidden cursor-pointer rounded-full text-2xl hover:text-primary group-hover:block">
          <EllipsisHorizontalIcon width={"1em"} />
        </span>
      </div>

      {/* 分隔线 */}
      <div className="my-2 border-b border-dashed border-secondary"></div>

      <div className=" relative">
        {/* 数据展示 */}
        <div className="flex justify-around py-3">
          {statList.map((item, index) => (
            <div key={index}>
              {item.value === undefined ? (
                <span className="text-5xl font-light">--</span>
              ) : (
                <span className="text-5xl font-medium">{item.value}</span>
              )}
              <span className=" ml-2 align-super text-lg">{item.label}</span>
            </div>
          ))}
        </div>

        {(loading || errorMessage) && (
          <div className=" absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-tertiary">
            {loading && (
              <span className="text-2xl text-secondary">
                <Loading />
              </span>
            )}

            {errorMessage && <span className="">{errorMessage}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeItem;

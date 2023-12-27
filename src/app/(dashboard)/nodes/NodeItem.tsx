"use client";

import Loading from "@/components/Loading";
import { request } from "@/utils/request";
import { useEffect, useMemo, useState } from "react";

function NodeItem({ nodeURL }: { nodeURL: string }) {
  const [loading, setLoading] = useState(false);
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
          setData(data);
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
    <div className="mx-auto mt-8 w-2/3 rounded-xl border border-[transparent] bg-tertiary p-4 hover:border-secondary">
      <div className="text-base text-secondary">
        <span>{useMemo(() => new URL(nodeURL).host, [nodeURL])}</span>
        {data ? (
          <span className="ml-1">{`(${data.node_name})`}</span>
        ) : (
          <span className="ml-3">
            <Loading></Loading>
          </span>
        )}
      </div>

      {/* 分隔线 */}
      <div className="my-2 border-b border-dashed border-secondary"></div>

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
    </div>
  );
}

export default NodeItem;

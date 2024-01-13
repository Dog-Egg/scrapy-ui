"use client";

import { schedule } from "@/actions";
import SchedulingForm from "./components/Form";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { url, project, version, spider } = searchParams;
  const router = useRouter();

  const list = [
    { label: "Node", value: url },
    { label: "Project", value: project },
    { label: "Version", value: version },
    { label: "Spider", value: spider },
  ];

  return (
    <div className="mx-auto my-48 flex justify-center pr-12">
      <div className="mt-[5rem]">
        <h3 className=" mb-5 text-3xl font-semibold">Scheduling Information</h3>
        <ul className=" list-[circle] pl-4">
          {list.map((item) =>
            item.value ? (
              <li className="leading-8">
                <label className="inline-block w-[4.5em] text-primary ">
                  {item.label}
                </label>
                <span className="text-secondary">{item.value}</span>
              </li>
            ) : (
              ""
            ),
          )}
        </ul>
      </div>
      <div className="ml-16 w-[30rem]">
        <SchedulingForm
          onSubmit={(values) => {
            schedule(url, project, spider, version || undefined, {
              priority: values.priority,
              settings:
                values.settings &&
                Object.fromEntries(
                  values.settings.map((item) => [item.key, item.value]),
                ),
              arguments:
                values.arguments &&
                Object.fromEntries(
                  values.arguments.map((item) => [item.key, item.value]),
                ),
            });
            router.push("/jobs");
          }}
        />
      </div>
    </div>
  );
}

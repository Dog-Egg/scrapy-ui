import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useMemo, useState } from "react";

dayjs.extend(utc);

const units: [string, number][] = [
  ["d", 60 * 60 * 24],
  ["h", 60 * 60],
  ["m", 60],
  ["s", 0],
];

const now = () => dayjs().utc().format("YYYY-MM-DD HH:mm:ss");

export function Timer({
  startTime,
  endTime,
  className,
}: {
  startTime: string;
  endTime?: string;
  className?: string;
}) {
  const [interalEndTime, setInteralEndTime] = useState(endTime);

  useEffect(() => {
    let handle: NodeJS.Timeout | undefined;
    if (!endTime) {
      setInteralEndTime(now());
      handle = setInterval(() => {
        setInteralEndTime(now());
      }, 1000);
    } else {
      setInteralEndTime(endTime);
    }
    return () => {
      clearInterval(handle);
    };
  }, [endTime]);

  const text = useMemo(() => {
    const parts = [];
    const seconds = dayjs(interalEndTime).diff(dayjs(startTime)) / 1000;
    let t = seconds;
    for (const [unit, n] of units) {
      if (t >= n) {
        const floor = Math.floor(n ? t / n : t);
        parts.push(floor + unit);
        t -= floor * n;
      }
    }
    return parts.join(" ");
  }, [startTime, interalEndTime]);

  return <span className={className}>{text}</span>;
}

"use client";

import * as actions from "@/actions/scrapyd-api";
import { setError } from "@/components/error-view";
import { Code } from "@/utils/enum";

/**
 * 将 Scrapyd API Action 返回的错误类型在 client 端统一处理，并解包正确的结果数据。
 */
function unwrap<
  T extends (...args: Parameters<T>) => Promise<actions.ResultType<P>>,
  P = ReturnType<T> extends Promise<actions.ResultType<infer S>> ? S : unknown,
>(action: T) {
  return async (...args: Parameters<typeof action>) => {
    const res = await action(...args);
    switch (res.code) {
      case Code.OK:
        return res.data;
      case Code.FETCH_FAILED:
        setError();
      default:
        throw Error("some error");
    }
  };
}

export const listjobs = unwrap(actions.listjobs);
export const listprojects = unwrap(actions.listprojects);
export const cancel = unwrap(actions.cancel);
export const listversions = unwrap(actions.listversions);
export const listspiders = unwrap(actions.listspiders);
export const schedule = unwrap(actions.schedule);
export const viewLog = unwrap(actions.viewLog);
export const viewItems = unwrap(actions.viewItems);
export const addversion = unwrap(actions.addversion);

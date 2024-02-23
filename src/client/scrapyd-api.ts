"use client";

import * as actions from "@/actions/scrapyd-api";
import { setError } from "@/components/error-view";
import { toast } from "@/components/ui/use-toast";
import { Code } from "@/utils/enum";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

/**
 * 将 Scrapyd API Action 返回的错误类型在 client 端统一处理，并解包正确的结果数据。
 */
function unwrap<
  T extends (...args: Parameters<T>) => Promise<actions.ResultType<P>>,
  P = ReturnType<T> extends Promise<actions.ResultType<infer S>> ? S : unknown,
>(action: T, { showProgress = true }: { showProgress?: boolean } = {}) {
  return async (...args: Parameters<typeof action>) => {
    showProgress && NProgress.start();
    const res = await action(...args);
    showProgress && NProgress.done();

    switch (res.code) {
      case Code.OK:
        return res.data;
      case Code.FETCH_FAILED:
        setError();
        throw Error("fetch failed");
      case Code.SCRAPYD_ERROR:
        toast({
          title: "Scrapyd Error",
          description: res.message,
          variant: "destructive",
        });
        throw Error(`Scrapyd Error: ${res.message}`);
      default:
        throw Error(`not implement for code ${res}.`);
    }
  };
}

export const listjobs = unwrap(actions.listjobs, { showProgress: false });
export const listprojects = unwrap(actions.listprojects);
export const cancel = unwrap(actions.cancel);
export const listversions = unwrap(actions.listversions);
export const listspiders = unwrap(actions.listspiders);
export const schedule = unwrap(actions.schedule);
export const viewLog = unwrap(actions.viewLog);
export const viewItems = unwrap(actions.viewItems);
export const addversion = unwrap(actions.addversion);
export const delproject = unwrap(actions.delproject);

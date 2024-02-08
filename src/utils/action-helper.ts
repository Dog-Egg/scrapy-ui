type ReturnOK<T> = { ok: true; data: T };
type ReturnErr = { ok: false; message?: string };

export type ReturnValue<T> = ReturnOK<T> | ReturnErr;

export const returnValue = {
  ok<T>(data?: T): ReturnOK<T | undefined> {
    return { ok: true, data };
  },
  err({ message }: { message?: string } = {}): ReturnErr {
    return { ok: false, message };
  },
};

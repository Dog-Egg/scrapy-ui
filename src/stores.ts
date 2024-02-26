import { create } from "zustand";
import { JobArgs } from "./utils/types";

type Type = "creation" | "copying";

interface SetOpenDialog {
  (open: true, type: Type): void;
  (open: false): void;
}

export const useScheduleFormDialog = create<{
  open: boolean;
  type: Type;
  setOpenDialog: SetOpenDialog;
  initFormValues?: JobArgs;
  setInitFormValues(values: JobArgs): void;
}>((set) => ({
  open: false,
  type: "creation",
  setOpenDialog(open) {
    if (open) {
      set({ open, type: arguments[1] });
    } else {
      set({ open });
    }
  },
  setInitFormValues: (values) => set({ initFormValues: values }),
}));

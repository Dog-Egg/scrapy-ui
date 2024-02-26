import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScheduleForm } from "./schedule-form";
import { useScheduleFormDialog } from "@/stores";
import { useMemo } from "react";

export function ScheduleFormDialog() {
  const { open, setOpenDialog: setOpen, type } = useScheduleFormDialog();

  const title = useMemo(() => {
    switch (type) {
      case "copying":
        return "Copy Job";
      case "creation":
        return "Create Job";
    }
  }, [type]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-scroll px-[2px]">
          <ScheduleForm
            onSubmitSuccess={() => {
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

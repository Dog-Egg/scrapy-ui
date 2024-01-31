import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScheduleForm } from "./schedule-form";

export function ScheduleFormDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create a Job</DialogTitle>
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

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormSetError, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import Input from "./Input";
import { forwardRef, useImperativeHandle, useRef } from "react";

const formSchema = z.object({
  url: z.string({ required_error: "URL is required." }).url(),
});

interface NodeFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
}

export type NodeFormHandle = Pick<HTMLFormElement, "requestSubmit"> & {
  setError: UseFormSetError<{
    url: string;
  }>;
};

export const NodeForm = forwardRef<NodeFormHandle, NodeFormProps>(function (
  props: NodeFormProps,
  ref,
) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { setError } = form;

  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        requestSubmit() {
          formRef.current?.requestSubmit();
        },
        setError,
      };
    },
    [setError],
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(props.onSubmit || (() => {}))}
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node URL</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});

NodeForm.displayName = "NodeForm";

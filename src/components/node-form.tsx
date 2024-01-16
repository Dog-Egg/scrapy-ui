"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { forwardRef } from "react";

const formSchema = z.object({
  url: z.string({ required_error: "URL is required." }).url(),
});

interface NodeFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
}

export const NodeForm = forwardRef<HTMLFormElement, NodeFormProps>(function (
  props: NodeFormProps,
  ref,
) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        ref={ref}
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

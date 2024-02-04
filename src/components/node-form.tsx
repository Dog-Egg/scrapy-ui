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
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Button from "./shorts/button";
import { daemonstatus } from "@/actions";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

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

  // test connection
  const watchUrl = form.watch("url");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failure" | "none">(
    "none",
  );
  useEffect(() => {
    // url 改变后清除测试结果
    setTestResult(() => {
      return "none";
    });
  }, [watchUrl]);

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
      {isUrl(watchUrl) && (
        <div className="flex items-center">
          <Button
            loading={testLoading}
            variant="outline"
            size="sm"
            onClick={async () => {
              setTestLoading(true);
              setTestResult("none");
              try {
                await daemonstatus(watchUrl, 1500);
                setTestResult("success");
              } catch {
                setTestResult("failure");
              } finally {
                setTestLoading(false);
              }
            }}
          >
            Test Connection
          </Button>
          <span
            className={
              "ml-2 inline-flex items-center text-xs text-muted-foreground"
            }
          >
            {testResult == "success" && (
              <>
                Connection successful
                <CheckIcon className="ml-1 h-4 w-4 text-success" />
              </>
            )}
            {testResult == "failure" && (
              <>
                Connection failure
                <Cross2Icon className="ml-1 h-4 w-4 text-destructive" />
              </>
            )}
          </span>
        </div>
      )}
    </Form>
  );
});

NodeForm.displayName = "NodeForm";

function isUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

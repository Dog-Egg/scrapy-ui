"use client";
import { addversion } from "@/client/scrapyd-api";
import Input from "@/components/Input";
import { useCurrentNode } from "@/components/node-provider";
import Button from "@/components/shorts/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Uploader } from "@/components/uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

dayjs.extend(utc);

export default function Page() {
  const formSchema = z.object({
    egg: z.instanceof(Blob, { message: "Egg 文件是必需的。" }),
    project: z.string({ required_error: "项目名称是必需的。" }),
    version: z.string().default(() => dayjs.utc().format("YYYYMMDDHHmmss")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const currentNode = useCurrentNode();
  const { toast } = useToast();
  function onSubmit(values: z.infer<typeof formSchema>) {
    const body = new FormData();
    body.append("egg", values.egg);
    body.append("project", values.project);
    body.append("version", values.version);

    if (currentNode) {
      setSubmitLoading(true);
      addversion(currentNode?.url, body)
        .then(() => {
          toast({
            title: "上传成功",
            description: (
              <ul>
                <li>项目: {values.project}</li>
                <li>版本: {values.version}</li>
              </ul>
            ),
          });
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    }
  }

  const watchProjectName = form.watch("project");

  const [submitLoading, setSubmitLoading] = useState(false);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="egg"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel required>Egg 文件</FormLabel>
                <FormControl>
                  <Uploader
                    accept=".egg"
                    beforeUpload={(file) => {
                      if (!watchProjectName) {
                        form.setValue("project", file.name.split(".")[0]);
                        form.clearErrors("project");
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  <code>
                    {
                      "scrapyd-deploy --include-dependencies --build-egg <your_project_name>.egg"
                    }
                  </code>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>项目名称</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>版本名称</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={submitLoading}>
            上传
          </Button>
        </form>
      </Form>
    </div>
  );
}

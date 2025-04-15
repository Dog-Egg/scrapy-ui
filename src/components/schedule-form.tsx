"use client";

import Input from "./Input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "./shorts/button";
import Select from "./shorts/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { ProjectSelect } from "./select-project";
import { VersionSelect } from "./select-version";
import { useState } from "react";
import { SpiderSelect } from "./select-spider";
import { schedule } from "@/client/scrapyd-api";
import { useCurrentNode } from "./node-provider";
import { useToast } from "./ui/use-toast";
import { useScheduleFormDialog } from "@/stores";

const formSchema = z.object({
  project: z.string({ required_error: "项目不能为空。" }),
  spider: z.string({ required_error: "爬虫不能为空。" }),
  version: z.optional(z.string()),
  arguments: z.array(
    z.object({
      key: z.string().trim().min(1, "参数的键不能为空。"),
      value: z.string().trim().min(1, "参数的值不能为空。"),
    }),
  ),
  settings: z.array(
    z.object({
      key: z.string().trim().min(1, "设置的键不能为空。"),
      value: z.string().trim().min(1, "设置的值不能为空。"),
    }),
  ),
  priority: z.optional(z.string()),
});

export function ScheduleForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess?(): void;
}) {
  const { initFormValues, type } = useScheduleFormDialog();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: type === "copying" ? initFormValues : undefined,
  });

  const argumentFields = useFieldArray({
    name: "arguments",
    control: form.control,
  });

  const settingFields = useFieldArray({
    name: "settings",
    control: form.control,
  });

  const currentNode = useCurrentNode();
  const { toast } = useToast();
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (currentNode) {
      setSubmitLoading(true);
      schedule(currentNode, values)
        .then(() => onSubmitSuccess?.())
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "糟糕！出错了。",
            description: error,
          });
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    }
  }

  const [submitLoading, setSubmitLoading] = useState(false);

  const [project, setProject] = useState<string>();
  const [version, setVerion] = useState<string>();

  // more
  const [showMore, setShowMore] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* project */}
        <FormField
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>项目</FormLabel>
              <FormControl>
                {type == "copying" ? (
                  <Input value={field.value} readOnly />
                ) : (
                  <ProjectSelect
                    className="w-full"
                    onValueChange={(value) => {
                      setProject(value);
                      field.onChange(value);
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* spider */}
        <FormField
          name="spider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>爬虫</FormLabel>
              <FormControl>
                {type == "copying" ? (
                  <Input readOnly value={field.value} />
                ) : (
                  <SpiderSelect
                    className="w-full"
                    project={project}
                    version={version}
                    onValueChange={field.onChange}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!showMore && type !== "copying" && (
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setShowMore(true);
              }}
            >
              显示更多
            </Button>
          </div>
        )}
        {(type === "copying" || showMore) && (
          <>
            {/* version */}
            <FormField
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>版本</FormLabel>
                  <FormControl>
                    {type == "copying" ? (
                      <Input value={field.value} placeholder="最新" readOnly />
                    ) : (
                      <VersionSelect
                        placeholder="最新"
                        className="w-full"
                        project={project}
                        onValueChange={(value) => {
                          setVerion(value);
                          field.onChange(value);
                        }}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />

            {/* arguments */}
            <FormItem>
              <FormLabel>参数</FormLabel>
              {argumentFields.fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-2 *:grow last:*:grow-0"
                >
                  <FormField
                    name={`arguments.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="键" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`arguments.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="值" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="shrink-0"
                    type="button"
                    size="icon"
                    icon={<Cross1Icon />}
                    variant="outline"
                    onClick={() => {
                      argumentFields.remove(index);
                    }}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="dashed"
                className="w-full"
                icon={<PlusIcon />}
                onClick={() => {
                  argumentFields.append({ value: "", key: "" });
                }}
              >
                添加参数
              </Button>
              <FormDescription>运行爬虫时使用的参数。</FormDescription>
            </FormItem>

            {/* settings */}
            <FormItem>
              <FormLabel>设置</FormLabel>
              {settingFields.fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-2 *:grow last:*:grow-0"
                >
                  <FormField
                    name={`settings.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="键" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`settings.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="值" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="shrink-0 flex-grow-0"
                    type="button"
                    size="icon"
                    icon={<Cross1Icon />}
                    variant="outline"
                    onClick={() => {
                      settingFields.remove(index);
                    }}
                  ></Button>
                </div>
              ))}
              <Button
                type="button"
                variant="dashed"
                className="w-full"
                icon={<PlusIcon />}
                onClick={() => {
                  settingFields.append({ value: "", key: "" });
                }}
              >
                添加设置
              </Button>
              <FormDescription>运行爬虫时使用的 Scrapy 设置。</FormDescription>
            </FormItem>

            <FormField
              name="priority"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>优先级</FormLabel>
                    <FormControl>
                      <Select
                        className="w-full"
                        options={[
                          { label: "高", value: "10" },
                          { label: "中", value: "0" },
                          { label: "低", value: "-10" },
                        ]}
                        {...field}
                        defaultValue="0"
                      />
                    </FormControl>
                    <FormDescription>此项目爬虫队列的优先级。</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </>
        )}
        <Button type="submit" loading={submitLoading}>
          提交
        </Button>
      </form>
    </Form>
  );
}

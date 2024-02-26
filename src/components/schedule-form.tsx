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
  project: z.string({ required_error: "The project is required." }),
  spider: z.string({ required_error: "The spider is required." }),
  version: z.optional(z.string()),
  arguments: z.array(
    z.object({
      key: z.string().trim().min(1, "The key of argument is required."),
      value: z.string().trim().min(1, "The value of argument is required."),
    }),
  ),
  settings: z.array(
    z.object({
      key: z.string().trim().min(1, "The key of setting is required."),
      value: z.string().trim().min(1, "The value of setting is required."),
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
            title: "Oh no! Something went wrong.",
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
              <FormLabel>Project</FormLabel>
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
              <FormLabel>Spider</FormLabel>
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
              show more
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
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    {type == "copying" ? (
                      <Input
                        value={field.value}
                        placeholder="Latest"
                        readOnly
                      />
                    ) : (
                      <VersionSelect
                        placeholder="Latest"
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
              <FormLabel>Arguments</FormLabel>
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
                          <Input placeholder="Key" {...field} />
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
                          <Input placeholder="Value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="shrink-0 grow-0"
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
                Add Argument
              </Button>
              <FormDescription>
                The arguments to use when running the spider.
              </FormDescription>
            </FormItem>

            {/* settings */}
            <FormItem>
              <FormLabel>Settiings</FormLabel>
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
                          <Input placeholder="Key" {...field} />
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
                          <Input placeholder="Value" {...field} />
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
                Add Setting
              </Button>
              <FormDescription>
                Scrapy settings to use when running the spider.
              </FormDescription>
            </FormItem>

            <FormField
              name="priority"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select
                        className="w-full"
                        options={[
                          { label: "High", value: "10" },
                          { label: "Medium", value: "0" },
                          { label: "Low", value: "-10" },
                        ]}
                        {...field}
                        defaultValue="0"
                      />
                    </FormControl>
                    <FormDescription>
                      Priority for this project’s spider queue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </>
        )}
        <Button type="submit" loading={submitLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

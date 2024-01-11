"use client";

import Form from "@/components/Form";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { url, project, version, spider } = searchParams;
  return (
    <div>
      <Form>
        <Form.Item label="Settings"></Form.Item>
      </Form>
    </div>
  );
}

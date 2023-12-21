"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { useState } from "react";

function AddNode() {
  const [address, setAddress] = useState("");
  const [port, setPort] = useState("");
  return (
    <div>
      <Form className="mx-auto mt-40 w-1/3">
        <Form.Item label="Address">
          <Input placeholder="127.0.0.1" onChange={setAddress} />
        </Form.Item>
        <Form.Item label="Port">
          <Input placeholder="6800" onChange={setPort} />
        </Form.Item>
        <div className="mt-[2.75rem]">
          <Button block>Save</Button>
        </div>
      </Form>
    </div>
  );
}

export default AddNode;

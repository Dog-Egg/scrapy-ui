"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function required(msg: string) {
  return (value: any) => {
    if (!value || !value.trim()) {
      throw Error(msg);
    }
  };
}

function AddNode() {
  const router = useRouter();
  const [addressErrMsg, setAddressErrMsg] = useState("");

  const [isSaveLoading, setIsSaveLoading] = useState(false);

  return (
    <div className="relative flex h-full w-full justify-center">
      <Form
        className="absolute top-1/3 mx-auto w-1/3"
        onSubmit={(values) => {
          console.log("onSubmit", values);

          setIsSaveLoading(true);
          fetch("/api/nodes", {
            method: "post",
            body: JSON.stringify(values),
          })
            .then((resp) => {
              if (resp.ok) {
                router.back();
              } else {
                resp.json().then((data) => {
                  setAddressErrMsg(data.fieldErrors?.address);
                });
              }
            })
            .finally(() => {
              setIsSaveLoading(false);
            });
        }}
      >
        <Form.Item
          prop="url"
          label="Scrapyd URL"
          errorMsg={addressErrMsg}
          onClearErrorMsg={() => setAddressErrMsg("")}
          validators={[required("Scrapyd URL is required.")]}
        >
          <Input type="url" placeholder="http://127.0.0.1:6800" />
        </Form.Item>
        <div className="mt-[2.75rem]">
          <Button block disabled={isSaveLoading}>
            {isSaveLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddNode;

"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AddNode() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [addressErrMsg, setAddressErrMsg] = useState("");
  useEffect(() => {
    setAddressErrMsg("");
  }, [address]);

  const bodyData: APIData.Node = { address };
  return (
    <div className="relative flex h-full w-full justify-center">
      <Form className="absolute top-1/3 mx-auto w-1/3">
        <Form.Item label="Address" errorMsg={addressErrMsg}>
          <Input
            placeholder="127.0.0.1:6800"
            onChange={setAddress}
            defaultValue="127.0.0.1:6800"
          />
        </Form.Item>
        <div className="mt-[2.75rem]">
          <Button
            block
            onClick={() => {
              fetch("/api/nodes", {
                method: "post",
                body: JSON.stringify(bodyData),
              }).then((resp) => {
                if (resp.ok) {
                  router.back();
                } else {
                  resp.json().then((data) => {
                    setAddressErrMsg(data.fieldErrors?.address);
                  });
                }
              });
            }}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddNode;

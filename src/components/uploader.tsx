import { UploadIcon, FileIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Upload, { UploadProps } from "rc-upload";
import { RcFile } from "rc-upload/lib/interface";

export function Uploader({
  onChange,
  beforeUpload,
  ...props
}: UploadProps & { onChange?(e: unknown): void }) {
  const [file, setFile] = useState<RcFile>();

  return (
    <div>
      <Upload
        type="drag"
        className="block rounded-md border border-dashed px-10 py-16 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        beforeUpload={(file, ...args) => {
          beforeUpload?.(file, ...args);
          setFile(file);
          onChange?.({ target: { value: file, name: props.name } });
        }}
        {...props}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <UploadIcon className="mr-2" />
          <span>click or drag *.egg file here</span>
        </div>
      </Upload>
      {file && (
        <div className="mt-1 flex items-center">
          <FileIcon className="mr-2" />
          {file.name}
        </div>
      )}
    </div>
  );
}

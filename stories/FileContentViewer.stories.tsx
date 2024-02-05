import { Meta } from "@storybook/react";
import {
  FileContentViewer,
  FileContentViewerHandle,
} from "@/components/file-content-viewer";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const meta: Meta<typeof FileContentViewer> = {
  component: FileContentViewer,
};
export default meta;

function WithHook() {
  const ref = useRef<FileContentViewerHandle>(null);
  return (
    <div>
      <Button
        onClick={() => {
          ref.current?.render({
            title: "MyTitle",
            content: "Some content.",
          });
        }}
      >
        Open
      </Button>
      <FileContentViewer ref={ref} />
    </div>
  );
}

export const Primary = {
  render() {
    return <WithHook />;
  },
};

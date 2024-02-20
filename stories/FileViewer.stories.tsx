import { Meta } from "@storybook/react";
import { FileViewer } from "@/components/file-viewer";
import { Button } from "@/components/ui/button";
import { Reducer, useCallback, useMemo, useReducer } from "react";

const meta: Meta<typeof FileViewer> = {
  component: FileViewer,
};
export default meta;

function WithHook() {
  const reducer = useCallback<
    Reducer<
      { title: string; content: string; open: boolean; loading?: boolean },
      | { type: "close" }
      | { type: "open"; title: string; content: string }
      | { type: "refresh" }
      | { type: "stopRefresh"; content?: string }
    >
  >(function (state, action) {
    switch (action.type) {
      case "close":
        return { ...state, open: false };
      case "open":
        return { title: action.title, open: true, content: action.content };
      case "refresh":
        setTimeout(() => {
          dispatch({
            type: "stopRefresh",
            content: Array(100).fill(Date.now()).join("\n"),
          });
        }, 1500);
        return { ...state, loading: true };
      case "stopRefresh":
        return {
          ...state,
          loading: false,
          content: action.content || state.content,
        };
    }
  }, []);

  const [states, dispatch] = useReducer(reducer, {
    content: "",
    title: "",
    open: false,
  });

  return (
    <div>
      <Button
        onClick={() =>
          dispatch({
            type: "open",
            title: "MyTitle",
            content: Array(100).fill("A sentence").join("\n"),
          })
        }
      >
        Open
      </Button>
      <FileViewer
        {...states}
        showRefreshButton
        onOpenChange={() => {
          dispatch({ type: "close" });
        }}
        onRefresh={() => {
          dispatch({ type: "refresh" });
        }}
      />
    </div>
  );
}

export const Primary = {
  render() {
    return <WithHook />;
  },
};

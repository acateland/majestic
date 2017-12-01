import * as React from "react";
import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/theme/github";
import FileCoverage from "./test-file/coverage";
import TreeNode from "../stores/TreeNode";

export interface CodeViewerProps {
  node: TreeNode;
  code: string;
  markers: any[];
}

export default function CodeViewer({ code, markers, node }: CodeViewerProps) {
  return (
    <div>
      <FileCoverage node={node} />
      <AceEditor
        mode="javascript"
        theme="github"
        onChange={() => {}}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={code}
        markers={markers}
        width="100%"
        height="100vh"
      />
    </div>
  );
}
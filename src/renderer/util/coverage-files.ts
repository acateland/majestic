import { observable } from "mobx";
import { TestReconcilationState } from "jest-editor-support";
import TreeNodeType from "../types/node-type";
import TreeNode from "../stores/TreeNode";
import { Icons } from "./constants";
import { getTestFilePattern } from "./workspace";

let nodes = new Map<string, TreeNode>();

export function processCoverageTree(rootPath, value) {
  nodes = new Map<string, TreeNode>();
  const files = tranform(rootPath, value);
  return {
    files,
    nodes
  };
}

function tranform(rootPath, node, tree = []) {
  const children = observable<TreeNode>([]);
  const matcher = getTestFilePattern(rootPath);

  node.children &&
    node.children.forEach(child => {
      const path = child.path;
      let node;
      if (nodes.get(path) && child.type === "file") {
        node = nodes.get(path);
      } else {
        node = createNode(path, child, tree, child.type, rootPath, matcher);
      }

      if (
        child.type !== "file" &&
        node.childNodes &&
        node.childNodes.length > 0
      ) {
        children.push(node);
      } else if (child.type === "file") {
        children.push(node);
      }

      if (child.type === "file" && !nodes.get(path)) {
        nodes.set(path, node);
      }
    });

  return children;
}

function createNode(
  path: string,
  child: any,
  tree,
  type: TreeNodeType,
  rootPath: string,
  matcher
) {
  const isTest = matcher(path);
  const node = new TreeNode();
  node.id = path;
  node.hasCaret = child.type === "directory";
  node.iconName = child.type === "file" ? Icons.FileIcon : Icons.FolderIcon;
  node.label = child.name.replace(".html", "");
  node.isExpanded = true;
  node.childNodes = tranform(rootPath, child, tree);
  node.className = "tree-node-custom";
  node.path = path;
  node.status = "Unknown" as TestReconcilationState;
  node.output = "";
  node.type = type;
  node.isTest = isTest;
  node.parseItBlocks();
  return node;
}

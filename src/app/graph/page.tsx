import React from "react";
import Graph from "react-graph-vis";
import { Connections, Nodes, Path } from "../lib/utils";

interface GraphComponentProps {
  nodes: Nodes;
  connections: Connections;
  path: Path;
}

export default function GraphComponent({ nodes, connections, path }: GraphComponentProps) {

  if (!nodes || !connections) {
    return null;
  }

  const graph = {
    nodes: Object.keys(nodes).map((key) => ({
      id: key,
      label: nodes[key].name,
      title: nodes[key].name,
    })),
    edges: Object.keys(connections).reduce((edgesArray, key) => {
      const fromNode = parseInt(key);
      const toNodes = connections[key].map((toNode) => ({
        from: fromNode,
        to: parseInt(toNode),
        color: path && path[fromNode] === toNode ? { color: "red" } : { color: "#455896" }, // Change edge color based on path
      }));
      return [...edgesArray, ...toNodes];
    }, []),
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    height: "600px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  return <Graph graph={graph} options={options} events={events} />;
}

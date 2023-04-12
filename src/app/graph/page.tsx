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
      const toNodes = connections[key].map((toNode) => ({ from: fromNode, to: parseInt(toNode) }));
      return [...edgesArray, ...toNodes];
    }, []),
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: (edge) => {
        // Determine color based on path
        const { from, to } = edge;
        const edgeKey = `${from}-${to}`;
        if (path && path.includes(edgeKey)) {
          console.log("tes")
          return { color: "red" }; // Set custom color for path edges
        } else {
          return { color: "#455896" }; // Default color for other edges
        }
      },
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

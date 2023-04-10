"use client";

//@ts-ignore
import CytoscapeComponent from "react-cytoscapejs";

export default function Graph() {
  const elements = [
    { data: { id: "one", label: "Node 1" }, position: { x: 100, y: 100 } },
    { data: { id: "two", label: "Node 2" }, position: { x: 200, y: 200 } },
    {
      data: { source: "one", target: "two", label: "Edge from Node1 to Node2" },
    },
  ];
  return (
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements({
        nodes: [
          {
            data: { id: "one", label: "A" },
            position: { x: 1, y: 1 },
          },
          {
            data: { id: "two", label: "B" },
            position: { x: 3, y: 3 },
          },
          {
            data: { id: "C", label: "C" },
            position: { x: 150, y: 100 },
          },
        ],
        edges: [
          {
            data: {
              source: "one",
              target: "two",
              label: "AB",
            },
          },
          {
            data: {
              source: "two",
              target: "C",
              label: "BC",
            },
          },
        ],
      })}
      stylesheet={[
        {
          selector: "node",
          style: {
            width: 1,
            height: 1,
            label: "data(label)",
            "font-size": 1,
          },
        },
        {
          selector: "edge",
          style: {
            width: 0.2,
            label: "data(label)",
            "font-size": 1,
          },
        },
      ]}
      panningEnabled={true}
      autolock={true}
      maxZoom={10}
      minZoom={1}
      zoom={10}
      boxSelectionEnabled={false}
      autounselectify={true}
      className="w-full h-screen text-sm"
    />
  );
}

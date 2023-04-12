'use client'

import Dropdown from "@/app/components/dropdown";
import {Connections, Edges, Nodes} from "@/app/lib/utils";
import {useState} from "react";

export default function DropdownNewEdge({
                                            nodes,
                                            edges,
                                            currentNode,
                                            connections,
                                            setConnections,
                                            setEdges,
                                        }: {
    nodes: Nodes;
    edges: Edges[];
    currentNode: string;
    connections: Connections;
    setConnections: (x: Connections) => void;
    setEdges: (x: Edges[]) => void;
}) {
    const [target, setTarget] = useState<string>();

    let new_nodes: Nodes = {}
    Object.keys(nodes).map((node) => {
        if (connections[currentNode] && !connections[currentNode].includes(node) && node !== currentNode) {
            new_nodes[node] = nodes[node]
        }
    })

    if (target) {
        if (connections && currentNode && !connections[currentNode].includes(target)) {
            connections[currentNode].push(target);
            connections[target].push(currentNode);
            setConnections({...connections});
            setEdges([...edges, {
                lat_init: nodes[currentNode].latitude,
                lng_init: nodes[currentNode].longitude,
                lat_target: nodes[target].latitude,
                lng_target: nodes[target].longitude,
                name: "E" + Object.keys(edges).length + 1,
                node_init: parseInt(currentNode) + 1,
                node_target: parseInt(target) + 1,
            }]);
            setTarget(undefined)
        }
    }

    return <Dropdown label={"Target"} nodes={new_nodes} setNode={(value) => setTarget(value)}/>
}
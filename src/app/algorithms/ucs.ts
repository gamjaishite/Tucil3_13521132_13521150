import calculate_distance, {Nodes, Path, Connections, ElementUCS, QueueElementUCS, PrioQueueUCS} from '../lib/utils';

export default function ucs(
    nodes: Nodes,
    connections: Connections,
    start: string,
    goal: string
) {
    let queueUCS = new PrioQueueUCS();
    let node: QueueElementUCS = {
        final_score: 0,
        node: start
    };

    queueUCS.enqueue(node);

    let raw_path: Path = {};
    let costSoFar: ElementUCS = {};
    costSoFar[start] = {f_score: 0};
    let explored: Set<string> = new Set();
    let currentElement;
    while (!queueUCS.isEmpty()) {
        currentElement = queueUCS.dequeue();
        let current = currentElement!.node;

        if (current === goal) {
            break;
        }

        explored.add(current);

        let neighbors = connections[current];
        if (neighbors) {
            for (const neighbor of neighbors) {
                if (!explored.has(neighbor)) {
                    let newCost = costSoFar[current].f_score + calculate_distance(nodes[current].latitude, nodes[current].longitude, nodes[neighbor].latitude, nodes[neighbor].longitude);
                    if (!costSoFar[neighbor] || newCost < costSoFar[neighbor].f_score) {
                        costSoFar[neighbor] = {f_score: newCost};
                        let priority = newCost;
                        let newElement: QueueElementUCS = {
                            final_score: priority,
                            node: neighbor
                        };
                        queueUCS.enqueue(newElement);
                        raw_path[neighbor] = current;
                    }
                }
            }
        }
    }

    if (currentElement && currentElement.node !== goal) {
        return {
            raw_path: undefined,
            path: undefined,
            cost: undefined,
        };
    }


    let raw_final_path: Path = {};
    let final_path: string[] = [];
    let reviewed_node: string = goal;
    while (reviewed_node !== start) {
        raw_final_path[raw_path[reviewed_node]] = reviewed_node;
        final_path.splice(0, 0, nodes[reviewed_node].name);
        reviewed_node = raw_path[reviewed_node];
    }
    final_path.splice(0, 0, nodes[start].name);

    return {
        raw_path: raw_final_path,
        path: final_path,
        cost: costSoFar[goal] ? costSoFar[goal].f_score : undefined
    };
}

export function ucsToString(path: string[]) {
    let beautified_path = "";
    for (let i = 0; i < path.length; i++) {
        if (i != 0) {
            beautified_path += " -> ";
        }
        beautified_path += path[i];
    }
    return beautified_path;
}

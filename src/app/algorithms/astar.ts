import calculate_distance, {
    Connections,
    ElementAStar,
    Nodes,
    Path,
    PriorityQueueAStar,
    QueueElementAStar,
} from "../lib/utils";

export default function astar(
    nodes: Nodes,
    connections: Connections,
    start: string,
    destination: string
) {
    let elements: ElementAStar = {};
    for (let label in nodes) {
        elements[label] = {
            g_score: Infinity,
            f_score: Infinity,
        };
    }
    elements[start].g_score = 0;
    elements[start].f_score = calculate_distance(
        nodes[start].latitude,
        nodes[start].longitude,
        nodes[destination].latitude,
        nodes[destination].longitude
    );

    let open_nodes = new PriorityQueueAStar();
    let node: QueueElementAStar = {
        heuristic_score: elements[start].f_score,
        final_score: elements[start].f_score,
        node: start,
    };
    open_nodes.enqueue(node);

    let raw_path: Path = {};
    let total_cost = 0;
    let current_node;
    while (!open_nodes.empty()) {
        current_node = open_nodes.dequeu()?.node;
        if (current_node === destination) {
            total_cost = elements[current_node].g_score;
            break;
        }

        if (connections[current_node]) {
            for (let neighbor_node of connections[current_node!]) {
                let temp_g_score =
                    elements[current_node!].g_score +
                    calculate_distance(
                        nodes[current_node!].latitude,
                        nodes[current_node!].longitude,
                        nodes[neighbor_node].latitude,
                        nodes[neighbor_node].longitude
                    );

                let heuristic_child_node = calculate_distance(
                    nodes[neighbor_node].latitude,
                    nodes[neighbor_node].longitude,
                    nodes[destination].latitude,
                    nodes[destination].longitude
                );

                let temp_f_score = temp_g_score + heuristic_child_node;

                if (temp_f_score < elements[neighbor_node].f_score) {
                    elements[neighbor_node].g_score = temp_g_score;
                    elements[neighbor_node].f_score = temp_f_score;

                    let child_node: QueueElementAStar = {
                        heuristic_score: heuristic_child_node,
                        final_score: temp_f_score,
                        node: neighbor_node,
                    };

                    open_nodes.enqueue(child_node);

                    raw_path[neighbor_node] = current_node!;
                }
            }
        }
    }

    if (current_node !== destination) {
        return {
            raw_path: undefined,
            path: undefined,
            cost: undefined,
        };
    }

    let raw_final_path: Path = {};
    let final_path: string[] = [];
    let reviewed_node: string = destination;

    while (reviewed_node !== start) {
        raw_final_path[raw_path[reviewed_node]] = reviewed_node;
        final_path.splice(0, 0, nodes[reviewed_node].name);
        reviewed_node = raw_path[reviewed_node];
    }
    final_path.splice(0, 0, nodes[start].name);

    return {
        raw_path: raw_final_path,
        path: final_path,
        cost: total_cost,
    };
}

export function astarToString(path: string[]) {
    let beautified_path = "";
    for (let i = 0; i < path.length; i++) {
        if (i != 0) {
            beautified_path += " -> ";
        }
        beautified_path += path[i];
    }
    return beautified_path;
}

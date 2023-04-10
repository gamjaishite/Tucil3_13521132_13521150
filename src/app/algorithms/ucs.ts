import calculate_distance, { Nodes, Path, Connections, ElementUCS, QueueElementUCS, PrioQueueUCS} from '../lib/utils';

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
  costSoFar[start] = { f_score: 0 };
  let explored: Set<string> = new Set(); 
  while (!queueUCS.isEmpty()) {
    let currentElement = queueUCS.dequeue();
    let current = currentElement!.node;

    if (current === goal) {
      return raw_path;
    }

    explored.add(current); 

    let neighbors = connections[current];
/**asjflafa */
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!explored.has(neighbor)) { 
          let newCost = costSoFar[current].f_score + calculate_distance(nodes[current].latitude, nodes[current].longitude, nodes[neighbor].latitude, nodes[neighbor].longitude);
          if (!costSoFar[neighbor] || newCost < costSoFar[neighbor].f_score) {
            costSoFar[neighbor] = { f_score: newCost };
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

  return raw_path;
}

export function ucsToString(path: Path, start: string, goal: string, nodes: Nodes): string {
  let finalPath: string[] = []; 
  let currentNode = goal; 

  while (currentNode !== start) {
    finalPath.splice(0, 0, nodes[currentNode].name);
    currentNode = path[currentNode];
  }

  finalPath.splice(0, 0, nodes[start].name);
  let final = finalPath.join(" -> ");
  return final;
}

export function returnCost(path:Path, start: string, goal:string, nodes: Nodes): number{
  let total : number = 0;
  let currentNode = goal; 

  return 1;
}
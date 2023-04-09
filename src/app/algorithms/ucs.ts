import { Connections, Nodes, calculate_distance } from "../lib/utils";

class PrioQueue {
  private queue: { nodes: Nodes, weight: number }[];

  constructor() {
    this.queue = []
  }

  isEmpty() {
    return this.queue.length == 0;
  }

  size() {
    return this.queue.length
  }

  isFull() {
    return this.queue.length == this.size()
  }

  enqueue(nodes: Nodes, weight: number) {
    this.queue.push({ nodes, weight })
    this.queue.sort((a, b) => a.weight - b.weight);
  }

  dequeue() {
    return this.queue.shift();
  }

}


export default function ucs(nodes: Nodes, connections: Connections, start: string, goal: string) {
  let queueUCS = new PrioQueue();

}

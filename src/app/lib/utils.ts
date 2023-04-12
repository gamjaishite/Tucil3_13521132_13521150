"use client";

export interface Nodes {
  [key: string]: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface Connections {
  [key: string]: string[];
}

export interface ElementUCS {
  [key: string]: {
    f_score: number;
  };
}
export interface QueueElementUCS {
  final_score: number;
  node: string;
}

export interface Edges {
  lat_init: number;
  lng_init: number;
  lat_target: number;
  lng_target: number;
  name: string;
  node_init: number;
  node_target: number;
}

export interface QueueElementAStar {
  final_score: number;
  heuristic_score: number;
  node: string;
}

export interface ElementAStar {
  [key: string]: {
    g_score: number;
    f_score: number;
  };
}

export interface Path {
  [key: string]: string;
}

export default function calculate_distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) dist = 1;
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist * 1000;
}

export class QElement {
  element: QueueElementAStar;
  constructor(element: QueueElementAStar) {
    this.element = element;
  }
}

export class QElementUCS {
  elementUCS: QueueElementUCS;
  constructor(elementUCS: QueueElementUCS) {
    this.elementUCS = elementUCS;
  }
}

export class PriorityQueueAStar {
  items: QueueElementAStar[];
  constructor() {
    this.items = [];
  }

  enqueue(element: QueueElementAStar) {
    let qElement = new QElement(element);
    let contain = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].final_score > qElement.element.final_score) {
        this.items.splice(i, 0, qElement.element);
        contain = true;
        break;
      }
      if (this.items[i].heuristic_score > qElement.element.heuristic_score) {
        this.items.splice(i, 0, qElement.element);
        contain = true;
        break;
      }
    }

    if (!contain) {
      this.items.push(qElement.element);
    }
  }

  dequeu() {
    return this.items.shift();
  }

  empty() {
    return this.items.length === 0;
  }
}

export class PrioQueueUCS {
  queueUCS: QueueElementUCS[];

  constructor() {
    this.queueUCS = [];
  }

  isEmpty() {
    return this.queueUCS.length == 0;
  }

  size() {
    return this.queueUCS.length;
  }

  isFull() {
    return this.queueUCS.length == this.size();
  }

  enqueue(elementUCS: QueueElementUCS) {
    let qelementUCS = new QElementUCS(elementUCS);
    this.queueUCS.push(qelementUCS.elementUCS);

    for (let i = 0; i < this.size(); i++) {
      for (let j = 0; j < this.size() - i - 1; j++) {
        if (this.queueUCS[j].final_score > this.queueUCS[j + 1].final_score) {
          const temp = this.queueUCS[j];
          this.queueUCS[j] = this.queueUCS[j + 1];
          this.queueUCS[j + 1] = temp;
        }
      }
    }
  }

  dequeue() {
    return this.queueUCS.shift();
  }
}

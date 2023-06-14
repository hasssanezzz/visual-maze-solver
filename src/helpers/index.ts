import { getShortestPath } from "./getShortestPath";
import { getShortestPathDijkstra } from "./getShortestPathDijkstra";
import { Pair } from "./pair";

export function make2dArray<T>(size: number, fill: T): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < size; i++) result.push(new Array<T>(size).fill(fill));
  return result;
}

export { getShortestPath, Pair, getShortestPathDijkstra };

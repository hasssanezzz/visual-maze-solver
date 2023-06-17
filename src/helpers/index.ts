import { getShortestPath } from "./getShortestPath";
import { getShortestPathDijkstra } from "./getShortestPathDijkstra";
import { getShortestPathAstar } from "./getShortestPathAstar";
import { Pair } from "./pair";
import { DELAY } from "../constants";

export function make2dArray<T>(size: number, fill: T): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < size; i++) result.push(new Array<T>(size).fill(fill));
  return result;
}

export async function sleep(time = DELAY) {
  await new Promise((r) => setTimeout(r, time))
}

export { getShortestPath, Pair, getShortestPathDijkstra, getShortestPathAstar };

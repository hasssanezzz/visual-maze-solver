import { Pair, make2dArray, setCellColor, sleep } from "."
import { PriorityQueue } from "datastructures-js"
import { dx_4d, dx_8d, dy_4d, dy_8d } from "../constants"

export async function getShortestPathAstar(
  start: Pair,
  end: Pair,
  blocks: boolean[][],
  size: number,
  directions: 4 | 8 = 4
) {
  const selectedHeuristic = +(<HTMLSelectElement>(
    document.getElementById("heuristic")
  )).value

  const isSafe = (x: number, y: number) =>
    x < size && y < size && x >= 0 && y >= 0 && !blocks[x][y]

  function getNeighbors(p: Pair): Pair[] {
    const neighbors: Pair[] = []

    for (let i = 0; i < directions; i++) {
      const x = p.first + (directions === 8 ? dx_8d[i] : dx_4d[i]),
          y = p.second + (directions === 8 ? dy_8d[i] : dy_4d[i])

      if (isSafe(x, y)) {
        neighbors.push(new Pair(x, y))
      }
    }

    return neighbors
  }

  async function aStar(start: Pair, end: Pair) {
    const distance = make2dArray<number>(size, Infinity)
    const visited = make2dArray<boolean>(size, false)
    const prev = make2dArray<Pair | null>(size, null)

    distance[start.first][start.second] = 0

    const q = new PriorityQueue<Pair>((a: Pair, b: Pair) => {
      const f1 = distance[a.first][a.second] + heuristic(a, end)
      const f2 = distance[b.first][b.second] + heuristic(b, end)
      return f1 - f2
    }) as PriorityQueue<Pair>

    q.push(start)

    while (q.size() > 0) {
      // add some delay
      await sleep()

      const p = q.front()
      q.pop()

      if (visited[p.first][p.second]) {
        continue
      }

      visited[p.first][p.second] = true

      if (
        (start.first != p.first || start.second != p.second) &&
        (end.first != p.first || end.second != p.second)
      )
        setCellColor(p.first, p.second)

      if (p.first === end.first && p.second === end.second) {
        break
      }

      const neighbors = getNeighbors(p)
      for (const neighbor of neighbors) {
        const alt = distance[p.first][p.second] + 1
        if (alt < distance[neighbor.first][neighbor.second]) {
          distance[neighbor.first][neighbor.second] = alt
          prev[neighbor.first][neighbor.second] = p
          q.push(neighbor)
        }
      }
    }

    const path: Pair[] = []
    let current: Pair | null = end
    while (current !== null) {
      path.unshift(current)
      current = prev[current.first][current.second]
    }
    return path
  }

  function heuristics() {
    function manhattanDistance(a: Pair, b: Pair) {
      const dx = Math.abs(a.first - b.first)
      const dy = Math.abs(a.second - b.second)
      return dx + dy
    }
    function diagonalDistance(a: Pair, b: Pair) {
      const dx = Math.abs(a.first - b.first)
      const dy = Math.abs(a.second - b.second)
      return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy)
    }
    function euclideanDistance(a: Pair, b: Pair) {
      const dx = a.first - b.first
      const dy = a.second - b.second
      return Math.sqrt(dx * dx + dy * dy)
    }
    function chebyshevDistance(a: Pair, b: Pair) {
      const dx = Math.abs(a.first - b.first)
      const dy = Math.abs(a.second - b.second)
      return Math.max(dx, dy)
    }
    function octileDistance(a: Pair, b: Pair) {
      const dx = Math.abs(a.first - b.first)
      const dy = Math.abs(a.second - b.second)
      const D = 1
      const D2 = Math.sqrt(2)
      return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
    }
    function squaredEuclideanDistance(a: Pair, b: Pair) {
      const dx = a.first - b.first
      const dy = a.second - b.second
      return dx * dx + dy * dy
    }
    function minkowskiDistance(a: Pair, b: Pair, p: number = 10) {
      const dx = Math.abs(a.first - b.first)
      const dy = Math.abs(a.second - b.second)
      return Math.pow(Math.pow(dx, p) + Math.pow(dy, p), 1 / p)
    }
    return [
      manhattanDistance,
      diagonalDistance,
      euclideanDistance,
      chebyshevDistance,
      octileDistance,
      squaredEuclideanDistance,
      minkowskiDistance,
    ]
  }

  const heuristic = heuristics()[selectedHeuristic]

  return await aStar(start, end)
}

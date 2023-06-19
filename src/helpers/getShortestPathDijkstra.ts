import { Pair, make2dArray, setCellColor, sleep } from '.'
import { PriorityQueue } from 'datastructures-js'

//TODO: implement dijkstra finding all shortest paths

export async function getShortestPathDijkstra(
  start: Pair,
  end: Pair,
  blocks: boolean[][],
  size: number
) {
  const isSafe = (x: number, y: number) =>
    x < size && y < size && x >= 0 && y >= 0 && !blocks[x][y]

  function getNeighbors(p: Pair): Pair[] {
    const neighbors: Pair[] = []
    const dx = [0, 0, 1, -1]
    const dy = [1, -1, 0, 0]

    for (let i = 0; i < 4; i++) {
      const x = p.first + dx[i]
      const y = p.second + dy[i]

      if (isSafe(x, y)) {
        neighbors.push(new Pair(x, y))
      }
    }

    return neighbors
  }

  async function dijkstra(start: Pair, end: Pair) {
    const distance = make2dArray<number>(size, Infinity)
    const visited = make2dArray<boolean>(size, false)
    const prev = make2dArray<Pair | null>(size, null)

    let isSolvable = false

    distance[start.first][start.second] = 0

    const q = new PriorityQueue<Pair>(
      (a: Pair, b: Pair) =>
        distance[a.first][a.second] - distance[b.first][b.second]
    ) as PriorityQueue<Pair>

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
        isSolvable = true
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

    if (isSolvable) {
      const path: Pair[] = []
      let current: Pair | null = end
      while (current !== null) {
        path.unshift(current)
        current = prev[current.first][current.second]
      }
      return path
    }

    return null
  }

  return await dijkstra(start, end)
}

import { DELAY, VISITED_CELL_COLOR } from '../constants'
import { Pair, make2dArray } from '.'

async function sleep(time = DELAY) {
  await new Promise((r) => setTimeout(r, time))
}

export async function getShortestPath(
  start: Pair,
  end: Pair,
  blocks: boolean[][],
  size: number
) {
  const dx = [-1, 1, 0, 0]
  const dy = [0, 0, 1, -1]

  const isSafe = (x: number, y: number) =>
    x < size && y < size && x >= 0 && y >= 0 && !blocks[x][y]

  const setBoxColor = (i: number, j: number, color = VISITED_CELL_COLOR) => {
    if (
      (start.first != i || start.second != j) &&
      (end.first != i || end.second != j)
    )
      document.getElementById(`c-${i}-${j}`)!.style.backgroundColor = color
  }

  async function bfs(start: Pair, end: Pair) {
    const visited: boolean[][] = make2dArray(size, false)
    const distance: number[][] = make2dArray(size, Number.MAX_SAFE_INTEGER)
    const parent = make2dArray(
      size,
      new Pair(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    )

    let isSolvable = false

    parent[start.first][start.second] = new Pair(-1, -1)

    const q: Pair[] = []
    q.push(start)

    while (q.length > 0) {
      // add some delay
      await sleep()

      const p = q[0]
      visited[p.first][p.second] = true
      q.shift()

      setBoxColor(p.first, p.second)

      if (p.first === end.first && p.second === end.second) {
        isSolvable = true
        break
      }

      for (let i = 0; i < 4; i++) {
        const x = p.first + dx[i],
          y = p.second + dy[i]

        if (isSafe(x, y) && !visited[x][y]) {
          distance[x][y] = distance[p.first][p.second] + 1
          visited[x][y] = true
          parent[x][y] = p

          q.push(new Pair(x, y))
        }
      }
    }

    if (isSolvable) {
      const dq: Pair[] = []
      let p1 = end.first,
        p2 = end.second

      while (p1 != -1 && p1 != Number.MIN_SAFE_INTEGER) {
        dq.unshift(new Pair(p1, p2))

        const tempPair = parent[p1][p2]
        p1 = tempPair.first
        p2 = tempPair.second
      }

      return dq
    }

    return null
  }

  return await bfs(start, end)
}

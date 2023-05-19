import { make2dArray } from './makeArray'
import './style.css'

const SIZE = 5
let mat: number[][] = make2dArray(SIZE, 1), visited = make2dArray(SIZE, false)

let v: [number, number][] = []
const sols: [number, number][][] = []

function main() {
  const grid = document.getElementById('grid'), select = document.querySelector("#mode"), startBtn = document.querySelector('#start')
  let mode: 'blocks' | 'target' | 'location' = 'blocks'

  grid!.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`
  

  let target = [SIZE-1, SIZE-1], location = [0 , 0]

  function render() {
    grid!.innerHTML = ""
    mat.forEach((arr, i) =>
      arr.forEach((num, j) => {
        grid!.innerHTML += `<button id="c-${i}-${j}" i="${i}" j="${j}" class="aspect-square border border-black box ${
          num === 0 ? 'bg-black text-white' : (location[0] === i && location[1] === j ? 'bg-green-500' : (target[0] === i && target[1] == j && "bg-blue-500"))
        }">${i},${j}</button>`
      })
    )

    document.querySelectorAll('.box').forEach((box) => {
      box.addEventListener('click', () => {
        const [i, j] = box.innerHTML.split(',').map(i => +i)
        console.log(mode)
        if (mode === 'blocks') {
          mat[i][j] = mat[i][j] === 1 ? 0 : 1
        } else if(mode === 'location' && mat[i][j] === 1 && (location[0] !== i || location[1] !== j)) {
          location[0] = i, location[1] = j
        } else if(mode === 'target' && mat[i][j] === 1 && ((target[0] !== i || target[1] !== j))) {
          target = [i, j]
        }

        render()
      })
    })
  }

  select!.addEventListener('change', () => {
    mode = (<HTMLSelectElement>document.getElementById('mode')).value as 'blocks' | 'target' | 'location'
  })

  function isSafe(x: number, y: number): boolean {
    return x < SIZE && y < SIZE && x >= 0 && y >= 0 && mat[x][y] === 1 && !visited[x][y]
  }

  let lo = 0



  function itr(i: number = 0, j: number = 0, minDist: number = Number.MAX_SAFE_INTEGER, dist: number = 0): number {

    console.log(lo++, "Fetching", i, j, dist)

    if(target[0] === i && target[1] === j) {
      minDist = Math.min(dist, minDist)      

      const clone = JSON.parse(JSON.stringify(v))

      sols.push(clone)
      return minDist
    }

    visited[i][j] = true

    // down
    if(isSafe(i+1, j)) {
      v.push([i+1, j])
      minDist = itr(i+1, j, minDist, dist+1)
      v.pop()
    }

    // up
    if(isSafe(i-1, j)) {
      v.push([i-1, j])
      minDist = itr(i-1, j, minDist, dist+1)
      v.pop()
    }

    // right
    if(isSafe(i, j+1)) {
      v.push([i, j+1])
      minDist = itr(i, j+1, minDist, dist+1)
      v.pop()
    }

    // left
    if(isSafe(i, j-1)) {
      v.push([i, j-1])
      minDist = itr(i, j-1, minDist, dist+1)
      v.pop()
    }
    
    visited[i][j] = false

    return minDist
  }

  startBtn?.addEventListener('click', () => {
    lo = 0

    sols.length = 0

    let mn = itr(location[0], location[1])
    if(mn !== Number.MAX_SAFE_INTEGER) {
      const indecies = sols.map(arr => arr.length)
      const mnLength = Math.min(...indecies)
      const index = indecies.indexOf(mnLength)
  
      for(let i = 0; i < mnLength; i++) {
        if (sols[index][i][0] != target[0] ||  sols[index][i][1] != target[1])
        document.getElementById('c-' + sols[index][i][0] + '-' + sols[index][i][1])!.style.backgroundColor = 'red'
      }
    }
  })

  render()
}

main()

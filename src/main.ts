import { SIZE } from './constants'
import { Pair, getShortestPath } from './graphTesting'
import { make2dArray } from './makeArray'
import './style.css'

let mat: number[][] = make2dArray(SIZE, 1)

const blocks = make2dArray(SIZE, false)

function main() {
  const grid = document.getElementById('grid'),
    select = document.querySelector('#mode'),
    startBtn = document.querySelector('#start')
  let mode: 'blocks' | 'target' | 'location' = 'blocks'

  grid!.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`

  let target = new Pair(SIZE - 1, SIZE - 1),
    location = new Pair(0, 0)

  function render() {
    grid!.innerHTML = ''
    mat.forEach((arr, i) =>
      arr.forEach((_, j) => {
        const isLocation = location.first === i && location.second === j
        const isTarget = target.first === i && target.second === j
        grid!.innerHTML += `<button id="c-${i}-${j}" i="${i}" j="${j}" class="box aspect-square border border-black ${
          blocks[i][j] ? 'bg-black' : (isLocation || isTarget) && 'bg-green-600'
        }"></button>`
      })
    )

    document.querySelectorAll('.box').forEach((box) => {
      box.addEventListener('click', () => {
        const i = +box.getAttribute('i')!,
          j = +box.getAttribute('j')!

        console.log('Clicked')

        if (mode === 'blocks') {
          blocks[i][j] = !blocks[i][j]
          document.getElementById(`c-${i}-${j}`)!.style.backgroundColor =
            blocks[i][j] ? 'black' : 'white'
        }

        if (
          mode === 'location' &&
          !blocks[i][j] &&
          location != new Pair(i, j)
        ) {
          location.first = i
          location.second = j
          render()
        }

        if (
          mode === 'target' &&
          !blocks[i][j] &&
          (target.first !== i || target.second !== j)
        ) {
          target.first = i
          target.second = j
          render()
        }
      })
    })
  }

  select!.addEventListener('change', () => {
    mode = (<HTMLSelectElement>document.getElementById('mode')).value as
      | 'blocks'
      | 'target'
      | 'location'
  })

  startBtn?.addEventListener('click', async () => {
    render()

    const sol = await getShortestPath(
      new Pair(location.first, location.second),
      new Pair(target.first, target.second),
      blocks
    )

    if (sol) {
      sol.forEach((pair) => {
        if (
          (pair.first != target.first || pair.second != target.second) &&
          (pair.first != location.first || pair.second != location.second)
        )
          document.getElementById(
            `c-${pair.first}-${pair.second}`
          )!.style.backgroundColor = 'red'
      })
    } else {
      alert('No solutions found')
    }
  })

  render()
}

main()

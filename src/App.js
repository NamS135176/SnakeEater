import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { interval, switchMap, pipe } from 'rxjs'

function App() {
  function generateRandom(min, max, exclude) {
    let random;
    while (!random) {
      const x = Math.floor(Math.random() * (max - min + 1)) + min;
      if (exclude.indexOf(x) === -1) random = x;
    }
    return random;
  }

  const start = [1, 2, 3, 4]

  const [point, setPoint] = useState(generateRandom(1, 100, start))
  const list = []
  for (let index = 0; index < 100; index++) {
    list.push(index + 1)
  }

  const [snakePos, setSnakePos] = useState([start])

  const [direction, setDirection] = useState('right')

  const isBorderLeft = (pos) => {
    if (pos % 10 == 1) {
      return true
    }
    return false
  }

  const isBorderRight = (pos) => {
    if (pos % 10 == 0) {
      return true
    }
    return false
  }

  const isBorderTop = (pos) => {
    if (pos >= 1 && pos <= 10) {
      return true
    }
    return false
  }

  const isBorderBot = (pos) => {
    if (pos >= 91 && pos <= 100) {
      return true
    }
    return false
  }

  const pushItem = (item) => {
    const newList = Array.from(snakePos)
    newList[0].shift()
    newList[newList.length - 1].push(item)
    setSnakePos(newList)
  }

  const eatItem = (item) => {
    const newList = Array.from(snakePos)
    newList[newList.length - 1].push(item)
    setPoint(generateRandom(1, 100, newList.flat(1)))
    setSnakePos(newList)
  }

  const nextMove = (nextPos, sub) => {
    const newList = Array.from(snakePos)
    if (newList.flat(1).includes(nextPos) && newList.flat(1)[0] != nextPos) {
      console.log(nextPos);
      console.log(newList);
      sub.unsubscribe()
    }
    else {
      if (nextPos == point) {
        eatItem(nextPos)
      }
      else {
        pushItem(nextPos)
      }

    }
  }

  const goRight = (sub) => {
    const newList = Array.from(snakePos)
    const newListLength = newList.length
    const lastItem = newList[newListLength - 1]
    const lastPos = lastItem[lastItem.length - 1]
    let nextPos = 0
    if (isBorderRight(lastPos)) {
      nextPos = lastPos - 9
    }
    else {
      nextPos = lastPos + 1
    }
    nextMove(nextPos, sub)
  }

  const goLeft = (sub) => {
    const newList = Array.from(snakePos)
    const newListLength = newList.length
    const lastItem = newList[newListLength - 1]
    const lastPos = lastItem[lastItem.length - 1]
    let nextPos = 0
    if (isBorderLeft(lastPos)) {
      nextPos = lastPos + 9
    }
    else {
      nextPos = lastPos - 1
    }
    nextMove(nextPos, sub)
  }

  const goDown = (sub) => {
    const newList = Array.from(snakePos)
    const newListLength = newList.length
    const lastItem = newList[newListLength - 1]
    const lastPos = lastItem[lastItem.length - 1]
    let nextPos = 0
    if (isBorderBot(lastPos)) {
      nextPos = lastPos - 90
    }
    else {
      nextPos = lastPos + 10
    }
    nextMove(nextPos, sub)
  }

  const goUp = (sub) => {
    const newList = Array.from(snakePos)
    const newListLength = newList.length
    const lastItem = newList[newListLength - 1]
    const lastPos = lastItem[lastItem.length - 1]
    let nextPos = 0
    if (isBorderTop(lastPos)) {
      nextPos = lastPos + 90
    }
    else {
      nextPos = lastPos - 10
    }
    nextMove(nextPos, sub)
  }

  useEffect(() => {
    const keyDownHandler = event => {
      // event.preventDefault();
      if (event.key == 'ArrowUp') {
        console.log('click up');
        setDirection('up')
      }
      if (event.key == 'ArrowDown') {
        console.log('click down');
        setDirection('down')
      }
      if (event.key == 'ArrowRight') {
        console.log('click right');
        setDirection('right')
      }
      if (event.key == 'ArrowLeft') {
        console.log('click left');
        setDirection('left')
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  useEffect(() => {
    const interval$ = interval(100);

    const sub = interval$.pipe(
      switchMap((data) => {

        if (direction == 'up') {
          goUp(sub)
          return 'up'

        }
        if (direction == 'down') {
          goDown(sub)
          return 'down'

        }
        if (direction == 'right') {
          goRight(sub)
          return 'right'

        }
        if (direction == 'left') {
          goLeft(sub)
          return 'left'

        }
      })
    ).subscribe((data) => {
    })

    function unsub() {
      sub.unsubscribe();
    }

    return unsub;
  }, [direction])

  return (
    <div className="Page">
      <div className="play-ground">
        {
          list.map(item => {
            if (snakePos.flat(1)[snakePos.flat(1).length - 1] == item) {
              return <div className='snake-head' />
            }
            else if (snakePos.flat(1).includes(item)) {
              return <div className='dot-active' />
            }
            else if (item == point) {
              return <div className='point' />
            }
            else {
              return <div className='dot' />
            }
          })
        }
      </div>
    </div>
  );
}

export default App;

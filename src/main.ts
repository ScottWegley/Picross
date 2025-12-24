import './styles/tailwind.css'
import App from './App.svelte'
import { Board } from './lib/Board.ts'

const app = new App({
  target: document.getElementById('app') as HTMLElement
})

const main: (() => void) = () => {
  let PicrossBoard = new Board(5, 5);
  console.log(PicrossBoard.toString());
  PicrossBoard.fillCell(0, 3, true);
  PicrossBoard.fillCell(0, 1, true);
  PicrossBoard.fillCell(0,2,true);
  PicrossBoard.fillCell(1, 0, true);
  PicrossBoard.fillCell(1, 4, true);
  PicrossBoard.fillCell(2, 0, true);
  PicrossBoard.calculateHints();
  console.log(PicrossBoard.toString(true));
}

main();

export default app

<template>
  <div id="container">
      <div class="game-viewport" v-if="this.gameStarted">
          <div class="modal-pause" v-if="this.state!=='running'">
              <h4 id="pause-header" v-if="this.state === 'pause'">PAUSED</h4>
              <h4 id="pause-header" v-if="this.state === 'game over'">GAME OVER</h4>
              <div class="pause-options">
                  <button @click="restart"><i class="bi bi-arrow-repeat"></i></button>
                  <button @click="togglePause" v-if="this.state!=='game over'"><i class="bi bi-play-fill"></i></button>
              </div>
          </div>
          <div id="mask" class="white-text text-center">
            ☹️ Mobile is not supported. This game requires a keyboard to be played.
          </div>
          <div id="grid">
              <div v-for="row in this.gridRender" :key="getRandomId(row)" class="row-div">
                  <div v-for="square in row" :key="getRandomId(square)" :style="`width: calc(100%/${row.length}); padding-top: calc(100%/${row.length}); background-color: ${this.returnColor(square)}`" class="square-div">
                  </div>
              </div>
          </div>
          <div class="menu">
              <div class="preview">
                  <h5 class="text-white">PREVIEW</h5>
                  <div class="preview-img">
                      <img :src="`img/vanilla-js-tetris/${this.nextTetromino}.png`" style="filter: grayscale(100%);">
                  </div>
              </div>
              <div class="score">
                  <h5 class="text-white">SCORE</h5>
                  {{this.score}}
              </div>
              <div class="controls">
                  <h5 class="text-white">CONTROLS <i class="bi bi-keyboard"></i></h5>
                  <div class="text-white">Keys - Move</div>
                  <div class="text-white">Z - Rotate</div>
              </div>
              <div class="preview">
                  <button id="pause" @click="togglePause" v-if="this.state === 'running'">PAUSE</button>
                  <button id="pause" @click="togglePause" v-else-if="this.state === 'pause'">RESUME</button>
              </div>
              <h3>TETRIS <i class="bi bi-joystick"></i></h3>
          </div>
      </div>
      <div class="game-menu" v-else>
          <h1 class="text-white">TETRIS <i class="bi bi-joystick"></i></h1>
          <div class="menu-message">Press <span style="color: white; font-weight: 500;">start</span>!</div>
          <div id="start" @click="setGame">START</div>
          <div class="text-muted text-center">*Keyboard needed!</div>
      </div>
  </div>
</template>

<script>
import uniqid from 'uniqid'
import {getTetrominos, keyDownHandler, keyUpHandler, generateGrid, mainGameLoop, restartGame} from '@/utils/VanillaJsTetris.js'

export default {
  data(){
      return {
          columns: 12,
          rows: 18,
          state: 'game over',
          gameStarted: false,
          score: 0,
          grid: [],
          ticks: 0,
          gridRender: [],
          xPosition: 0,
          yPosition: 0,
          tetromino: getTetrominos(),
          nTetromino:undefined,
          nextTetromino:undefined,
          countTetromino:undefined,
          nRotation : 0,
          bQueuedTetris : [],
          countDown : 0,
          rightPressed:0,
          leftPressed : 0,
          downPressed : 0,
          zPressed : 0,
          intervalId: undefined
      }
  },
  methods:{
      returnColor(char){
          if (char == "_") {
              return "var(--white)";
          } else if (char == "b") {
              return "var(--blue)";
          } else if (char == "t") {
              return "var(--white)";
          }else{
              return 'var(--orange)';
          }
      },
      keyUp(event){
          return keyDownHandler.bind(this)(event);
      },
      keyDown(event){
          return keyUpHandler.bind(this)(event);
      },
      setGame(){
          generateGrid.bind(this)();
          this.gameStarted = true;
          this.state = 'running';
      },
      getRandomId(dummy){
          dummy
          return uniqid();
      },
      togglePause(){
          if (this.state === 'pause'){
              this.state = 'running';
          }else{
              this.state = 'pause';
          }
      },
      restart(){
          restartGame.bind(this)();
          
      }
  },
  mounted(){
      this.intervalId = window.setInterval(mainGameLoop.bind(this), 50);
      window.addEventListener('keydown', this.keyUp);
      window.addEventListener('keyup', this.keyDown);
  },
  beforeUnmount(){
      window.clearInterval(this.intervalId);
      window.removeEventListener('keydown', this.keyUp);
      window.removeEventListener('keyup', this.keyDown);
  }
}
</script>

<style scoped>
#pause-header{
  color: white;
  font-weight: 300;
}
.row-div{
  width: 100%;
}
.square-div{
  box-sizing: border-box;
  float:left;
}
#container{
  width: 100%;
  display: flex;
  justify-content:center;
  margin-top: 3rem;
}
#grid{
  max-width: 300px;
  width: 100%;
}
.game-viewport,
.game-menu{
  max-width: 500px;
  width: 100%;
  user-select: none;
  position: relative;
}
h1,h3,h5{
  text-align: center;
  color: var(--blue);
  margin-top: 2rem;
}
.menu-message{
  color: var(--black);
  text-align: center;
  margin: 1rem;
  font-size: 1.5rem;

  animation: size 2s infinite ease-in-out;
}
#start, #pause{
  border: 1px solid var(--blue);
  background-color: var(--blue);
  color: var(--white);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin: 2.5rem auto;
  text-align: center;
  width: fit-content;
  transition: 100ms ease;
}
#start:hover, #pause:hover{
  transform: scale(1.1);
  cursor: pointer;
}
@keyframes size {
0% {
  transform: scale(1);
}
50%{
  transform: scale(1.1);
}
100% {
  transform: scale(1);
}
}
.menu{
  position: absolute;
  max-width: 200px;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.preview{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.score{
  color: var(--blue);
  font-weight: 400;
  text-align: center;
  font-size: smaller;
}
.controls div{
  text-align: center;
  font-size: smaller;
  color: var(--blue);
}
.text-muted{
  font-size: smaller;
}
.preview-img{
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#mask{
  transform: scaleY(0);
  transform-origin: top;
  background-color: var(--blue);
  transition: transform 0.5s ease;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-pause{
  padding: 1rem;
  border: 1px solid var(--black);
  border-radius: 0.2rem;
  position: absolute;
  right: 0; left: 0;
  margin: 35% auto;
  background-color: var(--blue);
  width: fit-content;
  max-width: 12rem;
  width: 12rem;
  text-align: center;
}
#pause-header{
  margin-bottom: 1.5rem;
}
.pause-options{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.pause-options button{
  border: solid 1px var(--white);
  border-radius: 50%;
  padding: 0;margin: 0;
  color: var(--white);
  background-color:var(--orange);
  width: 2.5rem;
  height: 2.5rem;
  font-size: 2rem;
  line-height: 1rem;
  outline: none;
  cursor: pointer;
}
.pause-options button:hover{
  transform: scale(1.05);
}
@media (max-width: 768px) {
  .game-viewport,
  .game-menu{
      max-width: 300px;
  }
  .menu{
      max-width: 0px;
  }
  #mask{
      transform: scaleY(1);
  }
}
</style>
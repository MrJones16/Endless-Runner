// NAMES: Dominic Berardi, Peyton Jones, Luis Acevedo
// GAME TITLE: Super Rocket Jumper ~endless runner~
// DATE: 4/30/2022
// 
// CREATIVE TILT JUSTIFICATION
//
// Programming:
//
// One part of our game's code that we are particularly proud of is how the game handles difficulty.
// Over time, more obstacle prefabs are able to spawn.
// The obstacles have unique combinations that they are allowed to spawn in.
// Each of these combinations is a case inside of a massive switch statement.
// As time progresses, more and more of these cases open up.
// 
// Another part of the game's code that is interesting is how the rockets are programmed.
// Since many rockets will spawn over the course of a game, they cannot all share the same object code.
// So, a class of rockets is made that handles each and every singular rocket object spawn.
// This allows us to easily make changes to how rockets interact with the world-
// in terms of how many can spawn at once, the rate of fire, their position, and how gravity affects them.
//
// Style:
//
// We are proud of the SFX created for this game. 
// The rocket launch sound and explosion sound were created by us and are two seperate sounds.
// However, in game they sound like a singular noise. Splitting them up into two sounds allows
// for us to play them independently of each other, but to the player it sounds like one continuous noise.
//
// Another part of the game's style that we were happy with is how the player sprite is independent from the launcher sprite.
// The two sprites appear as one-- and are coded similarly, in a single container-- 
// but can still be visually manipulated independent of each other.
// Thus, the player can be running and jumping while the launcher has full range of movement.
//
// As far as the music, it is indeed royalty-free, we did not make it.
// However, we did edit it to be a shortened loop of the first ~15 seconds of the original song.
// So, some artistic changes were taken. The citation for the song is in the credits in-game.

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 1000},
        debug: false
      }
    },
    scene: [Menu, Play, Instruction, GameOver, Credits]
  }

let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyLEFT, keyRIGHT;

// High score variable
var highScore = 0;
var currScore = 0;

// Background music variable
var musicStarted = false;

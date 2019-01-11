import Phaser from "phaser";
import character from "./assets/char-sprite.png";
import ground from "./assets/platform.png";
import bomb from "./assets/bomb.png";
import star from "./assets/star.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  pixelArt: true,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let platforms;
let stars;
let cursors;
let objects;
let resources = 0;
let scoreText;
let speed = 160;
const game = new Phaser.Game(config);

function preload() {
  this.load.image("ground", ground);
  this.load.image("bomb", bomb);
  this.load.image("star", star);
  this.load.spritesheet('character', character, { frameWidth: 31, frameHeight: 60 });
}

function create() {
  platforms = this.physics.add.staticGroup();
  objects = this.physics.add.staticGroup();
  stars = this.physics.add.staticGroup();
  platforms.create(0, 400, 'ground');
  platforms.create(50, 250, 'ground');

  objects = this.physics.add.group({
    key: 'bomb',
    repeat: 6,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  //
  objects.children.iterate(function (child, index) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setY(getRandomInt(600));
    child.setX(getRandomInt(800));
    child.resources = 100;
    child.body.moves = false;
    child.immovable = true;
    child.reacting = false;
  });

  player = this.physics.add.sprite(60, 60, 'character');
  player.height = 30;
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: 0
  });

  // this.anims.create({
  //   key: 'turn',
  //   frames: [ { key: 'dude', frame: 4 } ],
  //   frameRate: 20
  // });

  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: 0
  });

  scoreText = this.add.text(16, 16, 'Resources: 0', { fontSize: '32px', fill: '#fff' });

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(objects, platforms);
  this.physics.add.collider(stars, platforms);

  this.physics.add.collider(player, objects, objectReaction, null, this);
}

function update() {
  player.setVelocityX(0);
  player.setVelocityY(0);
  speed = 100;

  if (cursors.shift.isDown) {
    speed = 200;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(speed * -1);
    player.anims.play('up', true);
  }
  if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.anims.play('down', true);
  }
  if (cursors.up.isDown) {
    player.setVelocityY(speed * -1);
    player.anims.play('up', true);
  }
  if (cursors.down.isDown) {
    player.setVelocityY(speed);
    player.anims.play('down', true);
  }

  if (cursors.space.isDown && resources >= 20) {
    resources -= 20;
    build();
  }
}

function build() {
  console.log(player);
  stars.create(player.x, player.y + player.height, 'star');
  // object.disableBody(true, true);
  // resources++;
  // scoreText.setText('Resources: ' + resources);
}

function objectReaction(player, object) {
  if (!object.reacting) {
    object.resources -= 10;
    object.reacting = true;
    resources += 10;
    scoreText.setText('Resources: ' + resources);
    if (object.resources <= 0) object.disableBody(true, true);
    setTimeout(() => object.reacting = false, 1000);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

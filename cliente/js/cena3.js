// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 3
var cena3 = new Phaser.Scene("Cena 3");

var tileset0;
var map;
var chao;
var player1;
var cursors;
var trilha;

cena3.preload = function () {
this.load.image("tileset0", "assets/terreno.png");
this.load.tilemapTiledJSON("map", "assets/teste6.json");
this.load.spritesheet("bruxa", "assets/brancadeneve.png", {
  frameWidth: 32,
  frameHeight: 48,
});
this.load.audio("musiquinha", "assets/musiquinha.mp3");
}

cena3.create = function () {
  // Trilha sonora
  trilha = this.sound.add("musiquinha");
  trilha.play();

  const map = this.make.tilemap({ key: "map" });

  // Primeira "tileset0" é o nome que está no tiled
  // Segundo "tileset0" é a key do preload
  const tileset = map.addTilesetImage("tileset0", "tileset0");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer("chao", tileset, 0, 0);
  const worldLayer = map.createStaticLayer("labirinto", tileset, 0, 0);

  // Jogador 1 - controles/animação
  player1 = this.physics.add.sprite(100, 90, "bruxa");
  player1.setCollideWorldBounds(true);

  //  Animação do player1
  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("bruxa", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("bruxa", { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "bruxa", frame: 0 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("bruxa", { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("bruxa", { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1,
  });

  cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.collider(player1, worldLayer);
  //worldLayer.setCollisionBetween();
  worldLayer.setCollisionByProperty({ collides: true });
}

cena3.update = function () {
if (cursors.left.isDown) {
  player1.setVelocityX(-100);
  player1.anims.play("left", true);
} else if (cursors.right.isDown) {
  player1.setVelocityX(100);
  player1.anims.play("right", true);
} else if (cursors.up.isDown) {
  player1.setVelocityY(-100);
  player1.anims.play("up", true);
} else if (cursors.down.isDown) {
  player1.setVelocityY(100);
  player1.anims.play("down", true);
} else {
  player1.setVelocityX(0);
  player1.setVelocityY(0);
  player1.anims.play("turn");
}
 }

export { cena3 };

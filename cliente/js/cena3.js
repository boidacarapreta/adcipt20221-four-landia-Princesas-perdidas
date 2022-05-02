//Notas pro professor: não sei se consegui colocar o som de colidir com a parede.

// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 3
var cena3 = new Phaser.Scene("Cena 3");

var tileset0;
var map;
var chao;
var player1;
var player2;
var cursors;
var trilha;
var cameras;
var parede;
var labirinto;

cena3.preload = function () {
  this.load.image("tileset0", "assets/terreno.png");
  this.load.tilemapTiledJSON("map", "assets/teste4.json");
  // Jogador 1
  this.load.spritesheet("bruxa", "assets/bruxa.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  //this.load.audio("musiquinha", "assets/musiquinha.mp3");
  this.load.audio("efeito", "assets/coli-arvore.mp3");
  
  // Jogador 2
  this.load.spritesheet("branca", "assets/brancadeneve.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

cena3.create = function () {
  // Trilha sonora
  //trilha = this.sound.add("musiquinha");
  //trilha.play();
  //trilha.setLoop(true);

  parede = this.sound.add("efeito");

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
  
  // Camada 1: terreno
  //labirinto = map.createStaticLayer("labirinto", tileset0, 0, 0);
  //labirinto.setCollisionByProperty({ collides: true });

  // Cena (960x960) maior que a tela (800x600)
  this.cameras.main.setBounds(0, 0, 1280, 800);
  this.physics.world.setBounds(0, 0, 1280, 800);

  // Câmera seguindo o personagem 1
  this.cameras.main.startFollow(player1);
  this.cameras.main.setZoom(2);

  var physics = this.physics;

  cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.collider(player1, worldLayer);
  
  //worldLayer.setCollisionBetween();
  worldLayer.setCollisionByProperty({ collides: true });

  // Detecção de colisão e disparo de evento: ARCas
  physics.add.collider(player1, worldLayer, hitTiles, null, this);
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

function hitTiles(player1, worldLayer) {
  // Ao colidir com a parede, toca o efeito sonoro
  parede.play();
}

export { cena3 };

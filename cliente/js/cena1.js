// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 3
var cena1 = new Phaser.Scene("Cena 1");

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
var A;
var W;
var S;
var D;
var vida;
var placarVida;
var gameOver;
var socket;

cena1.preload = function () {
  this.load.image("tileset0", "assets/terreno.png");
  this.load.tilemapTiledJSON("map", "assets/teste4.json");
  // Jogador 1
  this.load.spritesheet("bruxa", "assets/bruxa.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.audio("musiquinha", "assets/musiquinha.mp3");
  this.load.audio("efeito", "assets/efeito.mp3");

  // Jogador 2
  this.load.spritesheet("branca", "assets/brancadeneve.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  //Sprite tela cheia
  this.load.spritesheet("telacheia", "assets/telacheia2.png", {
    frameWidth: 75,
    frameHeight: 37,
  });

  //Sprite tela cheia
  this.load.spritesheet("vida", "assets/vida.png", {
    frameWidth: 150,
    frameHeight: 75,
  });
};

cena1.create = function () {
  // Trilha sonora
  //trilha = this.sound.add("musiquinha");
  //trilha.play();
  //trilha.setLoop(true);

  socket = io("https://still-tundra-75872.herokuapp.com/");

  parede = this.sound.add("efeito");

  map = this.make.tilemap({ key: "map" });

  // Primeira "tileset0" é o nome que está no tiled
  // Segundo "tileset0" é a key do preload
  tileset0 = map.addTilesetImage("tileset0", "tileset0");

  chao = map.createStaticLayer("chao", tileset0, 0, 0);

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

  // Jogador 2 - controles/animação
  player2 = this.physics.add.sprite(150, 90, "branca");
  player2.setCollideWorldBounds(true);

  this.anims.create({
    key: "S",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "A",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 4,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn2",
    frames: [{ key: "branca", frame: 0 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "D",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 8,
      end: 11,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "W",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 12,
      end: 15,
    }),
    frameRate: 10,
    repeat: -1,
  });

  W = this.input.keyboard.addKey("W");
  S = this.input.keyboard.addKey("S");
  A = this.input.keyboard.addKey("A");
  D = this.input.keyboard.addKey("D");

  // Camada 1: terreno
  labirinto = map.createStaticLayer("labirinto", tileset0, 0, 0);
  labirinto.setCollisionByProperty({ collides: true });

  // Cena (960x960) maior que a tela (800x600)
  this.cameras.main.setBounds(0, 0, 1280, 800);
  this.physics.world.setBounds(0, 0, 1280, 800);

  // Câmera seguindo o personagem 1
  this.cameras.main.startFollow(player1);
  this.cameras.main.setZoom(1);

  //Tela cheia
  var button2 = this.add //mudar onde o sprite fica para conseguir colocar no zoom 2
    .image(100 - 16, 450, "telacheia", 0)
    .setOrigin(1, 0)
    .setInteractive()
    .setScrollFactor(0);

  // Ao clicar no botão de tela cheia
  button2.on(
    "pointerup",
    function () {
      if (this.scale.isFullscreen) {
        button2.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button2.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  vida = 5;
  placarVida = this.add.sprite(900 - 16, 50, "vida", 0).setScrollFactor(0);

  var physics = this.physics;

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(player1, tileset0);
  this.physics.add.collider(player2, tileset0);
  this.physics.add.collider(player1, player2, hitPlayer, null, this);

  //worldLayer.setCollisionBetween();
  //worldLayer.setCollisionByProperty({ collides: true });

  // Detecção de colisão e disparo de evento: ARCas
  physics.add.collider(player1, labirinto, hitTiles, null, this);
  physics.add.collider(player2, labirinto, hitTiles2, null, this);
  physics.add.overlap(player1, player2, hitPlayer, null, this);
};

cena1.update = function () {
  if (gameOver) {
    this.scene.start(cena2);
  }

  if (cursors.left.isDown) {
    player1.setVelocityX(-100);
  } else if (cursors.right.isDown) {
    player1.setVelocityX(100);
  } else {
    player1.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    player1.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    player1.setVelocityY(100);
  } else {
    player1.setVelocityY(0);
  }

  if (cursors.left.isDown) {
    player1.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player1.anims.play("right", true);
  } else if (cursors.up.isDown) {
    player1.anims.play("up", true);
  } else if (cursors.down.isDown) {
    player1.anims.play("down", true);
  } else {
    player1.anims.play("turn");
  }

  if (A.isDown) {
    player2.setVelocityX(-100);
  } else if (D.isDown) {
    player2.setVelocityX(100);
  } else {
    player2.setVelocityX(0);
  }

  if (W.isDown) {
    player2.setVelocityY(-100);
  } else if (S.isDown) {
    player2.setVelocityY(100);
  } else {
    player2.setVelocityY(0);
  }

  if (A.isDown) {
    player2.anims.play("A", true);
  } else if (D.isDown) {
    player2.anims.play("D", true);
  } else if (W.isDown) {
    player2.anims.play("W", true);
  } else if (S.isDown) {
    player2.anims.play("S", true);
  } else {
    player2.anims.play("turn2");
  }
/*
  if (A.isDown) {
    player2.setVelocityX(-100);
    player2.anims.play("A", true);
  } else if (D.isDown) {
    player2.setVelocityX(100);
    player2.anims.play("D", true);
  } else if (W.isDown) {
    player2.setVelocityY(-100);
    player2.anims.play("W", true);
  } else if (S.isDown) {
    player2.setVelocityY(100);
    player2.anims.play("S", true);
  } else {
    player2.setVelocityX(0);
    player2.setVelocityY(0);
    player2.anims.play("turn2");
  }

*/
};
function hitTiles(player1, labirinto) {
  // Ao colidir com a parede, toca o efeito sonoro
  parede.play();
}

function hitTiles2(player2, labirinto) {
  // Ao colidir com a parede, toca o efeito sonoro
  parede.play();
}

function hitPlayer(player1, player2) {
  // Personagens se chocam
  vida--;
  placarVida.setFrame(5 - vida);
  console.log(vida, 5 - vida);
  player2.x = 550;
  player2.y = 650;

  if (vida === 0) {
    gameOver = true;
  }
}

export { cena1 };

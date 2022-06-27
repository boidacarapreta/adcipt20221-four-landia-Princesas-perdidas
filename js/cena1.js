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
var vida;
var placarVida;
var gameOver;
var jogador;
var socket;
var ice_servers = {
  iceServers: [
    {
      urls: "stun:ifsc.cloud",
    },
    {
      urls: "turns:ifsc.cloud",
      username: "etorresini",
      credential: "matrix",
    },
  ],
};
var localConnection;
var remoteConnection;
var midias;
const audio = document.querySelector("audio");

cena1.preload = function () {
  this.load.image("tileset0", "assets/terreno.png");
  this.load.tilemapTiledJSON("map", "assets/teste4.json");
  // Jogador 1
  this.load.spritesheet("bruxa", "assets/bruxa.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.audio("musiquinha", "assets/musiquinha.mp3");
  this.load.audio("efeito", "assets/coli-arvore.mp3");

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
  parede = this.sound.add("efeito");

  map = this.make.tilemap({ key: "map" });

  // Primeira "tileset0" é o nome que está no tiled - Segundo "tileset0" é a key do preload
  tileset0 = map.addTilesetImage("tileset0", "tileset0");

  chao = map.createLayer("chao", tileset0, 0, 0);

  // Jogador 1 - controles/animação
  player1 = this.physics.add.sprite(1150, 650, "bruxa");
  //player1.setCollideWorldBounds(true);

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
  //player2.setCollideWorldBounds(true);

  this.anims.create({
    key: "down2",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "left2",
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
    key: "right2",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 8,
      end: 11,
    }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "up2",
    frames: this.anims.generateFrameNumbers("branca", {
      start: 12,
      end: 15,
    }),
    frameRate: 10,
    repeat: -1,
  });

  /*
  W = this.input.keyboard.addKey("W");
  S = this.input.keyboard.addKey("S");
  A = this.input.keyboard.addKey("A");
  D = this.input.keyboard.addKey("D");
  */

  // Camada 1: terreno
  labirinto = map.createLayer("labirinto", tileset0, 0, 0);
  labirinto.setCollisionByProperty({ collides: true });

  // Cena (960x960) maior que a tela (800x600)
  this.cameras.main.setBounds(0, 0, 1280, 800);
  this.physics.world.setBounds(0, 0, 1280, 800);
  this.cameras.main.setZoom(1);

  // Câmera seguindo o personagem 1
  //this.cameras.main.startFollow(player1);
  //

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

  cursors = this.input.keyboard.createCursorKeys();

  var physics = this.physics;

  physics.add.collider(player1, tileset0);
  physics.add.collider(player2, tileset0);
  physics.add.collider(player1, player2, hitPlayer, null, this);

  //worldLayer.setCollisionBetween();
  //worldLayer.setCollisionByProperty({ collides: true });

  // Detecção de colisão e disparo de evento: ARCas
  //physics.add.collider(player1, labirinto, hitTiles, null, this);
  //physics.add.collider(player2, labirinto, hitTiles, null, this);
  physics.add.overlap(player1, player2, hitPlayer, null, this);

  socket = io("https://still-tundra-75872.herokuapp.com/");
  var physics = this.physics;
  var cameras = this.cameras;
  var time = this.time;

  socket.on("jogadores", (jogadores) => {
    if (jogadores.primeiro === socket.id) {
      // Define jogador como o primeiro
      jogador = 1;

      // Personagens colidem com os limites da cena
      player1.setCollideWorldBounds(true);

      // Detecção de colisão: terreno
      physics.add.collider(player1, labirinto, hitTiles, null, this);

      // Câmera seguindo o personagem 1
      cameras.main.startFollow(player1);

      placarVida.setVisible(false);

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          midias = stream;
        })
        .catch((error) => console.log(error));
    } else if (jogadores.segundo === socket.id) {
      // Define jogador como o segundo
      jogador = 2;

      // Personagens colidem com os limites da cena
      player2.setCollideWorldBounds(true);

      // Detecção de colisão: terreno
      physics.add.collider(player2, labirinto, hitTiles, null, this);

      // Câmera seguindo o personagem 2
      cameras.main.startFollow(player2);

      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          midias = stream;
          localConnection = new RTCPeerConnection(ice_servers);
          midias
            .getTracks()
            .forEach((track) => localConnection.addTrack(track, midias));
          localConnection.onicecandidate = ({ candidate }) => {
            candidate &&
              socket.emit("candidate", jogadores.primeiro, candidate);
          };
          console.log(midias);
          localConnection.ontrack = ({ streams: [midias] }) => {
            audio.srcObject = midias;
          };
          localConnection
            .createOffer()
            .then((offer) => localConnection.setLocalDescription(offer))
            .then(() => {
              socket.emit(
                "offer",
                jogadores.primeiro,
                localConnection.localDescription
              );
            });
        })
        .catch((error) => console.log(error));
    }

    // Os dois jogadores estão conectados
    console.log(jogadores);
    /*
    if (jogadores.primeiro !== undefined && jogadores.segundo !== undefined) {
      // Contagem regressiva em segundos (1.000 milissegundos)
      timer = 60;
      timedEvent = time.addEvent({
        delay: 1000,
        callback: countdown,
        callbackScope: this,
        loop: true,
      });
    }
    */
  });

  socket.on("offer", (socketId, description) => {
    remoteConnection = new RTCPeerConnection(ice_servers);
    midias
      .getTracks()
      .forEach((track) => remoteConnection.addTrack(track, midias));
    remoteConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit("candidate", socketId, candidate);
    };
    remoteConnection.ontrack = ({ streams: [midias] }) => {
      audio.srcObject = midias;
    };
    remoteConnection
      .setRemoteDescription(description)
      .then(() => remoteConnection.createAnswer())
      .then((answer) => remoteConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit("answer", socketId, remoteConnection.localDescription);
      });
  });

  socket.on("answer", (description) => {
    localConnection.setRemoteDescription(description);
  });

  socket.on("candidate", (candidate) => {
    const conn = localConnection || remoteConnection;
    conn.addIceCandidate(new RTCIceCandidate(candidate));
  });

  // Desenhar o outro jogador
  socket.on("desenharOutroJogador", ({ frame, x, y }) => {
    if (jogador === 1) {
      player2.setFrame(frame);
      player2.x = x;
      player2.y = y;
    } else if (jogador === 2) {
      player1.setFrame(frame);
      player1.x = x;
      player1.y = y;
    }
  });
};

cena1.update = function () {
  // Controle do personagem por direcionais
  /*if (jogador === 1 && vida >= 0) {
    if (cursors.left.isDown) {
      player1.body.setVelocityX(-100);
      player1.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player1.body.setVelocityX(100);
      player1.anims.play("right", true);
    } else {
      player1.body.setVelocity(0);
      player1.anims.play("turn", true);
    }
    if (cursors.up.isDown) {
      player1.body.setVelocityY(-100);
    } else if (cursors.down.isDown) {
      player1.body.setVelocityY(100);
    } else {
      player1.body.setVelocityY(0);
    }
    socket.emit("estadoDoJogador", {
      frame: player1.anims.getFrameName(),
      x: player1.body.x + 16,
      y: player1.body.y + 24,
    });
  } else if (jogador === 2 && vida >= 0) {
    if (cursors.left.isDown) {
      player2.body.setVelocityX(-100);
      player2.anims.play("A", true);
    } else if (cursors.right.isDown) {
      player2.body.setVelocityX(100);
      player2.anims.play("D", true);
    } else {
      player2.body.setVelocity(0);
      player2.anims.play("turn2", true);
    }
    if (cursors.up.isDown) {
      player2.body.setVelocityY(-100);
    } else if (cursors.down.isDown) {
      player2.body.setVelocityY(100);
    } else {
      player2.body.setVelocityY(0);
    }
    socket.emit("estadoDoJogador", {
      frame: player2.anims.getFrameName(),
      x: player2.body.x + 16,
      y: player2.body.y + 24,
    });
  }
};*/
 if (gameOver) {
   this.scene.start(cena2);
 }
  if (jogador === 1 && vida >= 0) {
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

    socket.emit("estadoDoJogador", {
      frame: player1.anims.getFrameName(),
      x: player1.body.x + 16,
      y: player1.body.y + 24,
    });
    
  } else if (jogador === 2 && vida >= 0) {
    if (cursors.left.isDown) {
      player2.setVelocityX(-100);
    } else if (cursors.right.isDown) {
      player2.setVelocityX(100);
    } else {
      player2.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      player2.setVelocityY(-100);
    } else if (cursors.down.isDown) {
      player2.setVelocityY(100);
    } else {
      player2.setVelocityY(0);
    }

    if (cursors.left.isDown) {
      player2.anims.play("left2", true);
    } else if (cursors.right.isDown) {
      player2.anims.play("right2", true);
    } else if (cursors.up.isDown) {
      player2.anims.play("up2", true);
    } else if (cursors.down.isDown) {
      player2.anims.play("down2", true);
    } else {
      player2.anims.play("turn2");
    }

    if (cursors.left.isDown) {
      player2.setVelocityX(-100);
      player2.anims.play("left2", true);
    } else if (cursors.right.isDown) {
      player2.setVelocityX(100);
      player2.anims.play("right2", true);
    } else if (cursors.up.isDown) {
      player2.setVelocityY(-100);
      player2.anims.play("up2", true);
    } else if (cursors.down.isDown) {
      player2.setVelocityY(100);
      player2.anims.play("down2", true);
    } else {
      player2.setVelocityX(0);
      player2.setVelocityY(0);
      player2.anims.play("turn2");
    }

    socket.emit("estadoDoJogador", {
      frame: player2.anims.getFrameName(),
      x: player2.body.x + 16,
      y: player2.body.y + 24,
    });
  }
};

function hitTiles(player1, player2, labirinto) {
  // Ao colidir com a parede, toca o efeito sonoro
  parede.play();
}

function hitPlayer(player1, player2) {
  // Personagens se chocam
  vida--;
  placarVida.setFrame(5 - vida);
  console.log(vida, 5 - vida);
  player2.x = 150;
  player2.y = 90;

  if (vida === 0) {
    gameOver = true;
  }
}

export { cena1 };

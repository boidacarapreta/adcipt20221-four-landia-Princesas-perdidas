// Importar a próxima cena
import { cena2 } from "./cena2.js";
import { cena3 } from "./cena3.js";

// Criar a cena 3
var cena1 = new Phaser.Scene("Cena 1");

var tileset0;
var map;
var chao;
var player1;
var player2;
var cursors;
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
var explicaprin;
var explicabru;
var sala;
var botao1;
var botao2;
var botao3;
var botao4;
var botao5;
var inventory;
var online;
var next;
var anoes;
const audio = document.querySelector("audio");

cena1.preload = function () {
  //Tiled
  this.load.image("tileset0", "assets/terreno2.png");
  this.load.tilemapTiledJSON("map", "assets/labirintopronto3.json");

  //Audios
  this.load.audio("musiquinha", "assets/musiquinha.mp3");
  this.load.audio("efeito", "assets/coli-arvore.mp3");

  //Bruxa
  this.load.spritesheet("bruxa", "assets/bruxa.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  //Princesas
  this.load.spritesheet("branca", "assets/brancadeneve.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  //Tela cheia
  this.load.spritesheet("telacheia", "assets/telacheia2.png", {
    frameWidth: 75,
    frameHeight: 37,
  });

  //Vida
  this.load.spritesheet("vida", "assets/vida2.png", {
    frameWidth: 87,
    frameHeight: 29,
  });

  //Explicações do que fazer
  this.load.image("explicaprin", "assets/eprincesa.png");
  this.load.image("explicabru", "assets/ebruxa.png");

  //salas
  this.load.image("sala1", "./assets/botaosala1.png");
  this.load.image("sala2", "./assets/botaosala2.png");
  this.load.image("sala3", "./assets/botaosala3.png");
  this.load.image("sala4", "./assets/botaosala4.png");
  this.load.image("sala5", "./assets/botaosala5.png");

  //anões
  this.load.image("anoes", "./assets/anoes.png");

  //D-pad
  this.load.spritesheet("setas", "assets/setas.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  //Imagem para entrar na sala
  this.load.image("waiting", "assets/escolhasala.png");

  //Imagem de explicações
  this.load.image("eprincesa", "assets/eprincesa.png");
  this.load.image("ebruxa", "assets/ebruxa.png");

  //Botão next
  this.load.image("next", "assets/next.png");

};

cena1.create = function () {
  online = false;
  //Trilha sonora
  //trilha = this.sound.add("musiquinha");
  //trilha.play();
  //trilha.setLoop(true);
  parede = this.sound.add("efeito");

  map = this.make.tilemap({ key: "map" });

  // Primeira "tileset0" é o nome que está no tiled - Segundo "tileset0" é a key do preload
  tileset0 = map.addTilesetImage("tileset0", "tileset0");

  chao = map.createLayer("chao", tileset0, 0, 0);
  chao.setCollisionByProperty({ collides: true });

  // Camada 1: terreno
  labirinto = map.createLayer("labirinto", tileset0, 0, 0);
  labirinto.setCollisionByProperty({ collides: true });


  // Jogador 1 - controles/animação
  player1 = this.physics.add.sprite(1800, 970, "bruxa");
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
  player2 = this.physics.add.sprite(185, 1030, "branca");
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

  // Cena (960x960) maior que a tela (800x600)
  this.cameras.main.setBounds(0, 0, 1920, 1088);
  this.physics.world.setBounds(0, 0, 1920, 1088);
  //this.cameras.main.setZoom(1);


  //Tela cheia
  var button2 = this.add //mudar onde o sprite fica para conseguir colocar no zoom 2
    .image(300, 130, "telacheia", 0)
    //.setScale(0.5)
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

  anoes = this.physics.add.sprite(250, 220, "anoes");

  vida = 3;
  placarVida = this.add.sprite(670, 150, "vida", 0).setScrollFactor(0);

  cursors = this.input.keyboard.createCursorKeys();

  var physics = this.physics;

  physics.add.collider(player1, tileset0);
  physics.add.collider(player2, tileset0);
  physics.add.collider(player1, player2, hitPlayer, null, this);
  physics.add.overlap(player1, player2, hitPlayer, null, this);
  physics.add.overlap(player2, anoes, null, null, this); //add uma função

  // D-pad
  var esquerda = this.add
    .image(610, 360, "setas", 0)
    .setInteractive()
    .setScrollFactor(0)
    .setScale(0.8);
  var direita = this.add
    .image(670, 360, "setas", 2)
    .setInteractive()
    .setScrollFactor(0)
    .setScale(0.8);
  var cima = this.add
    .image(290, 300, "setas", 6)
    .setInteractive()
    .setScrollFactor(0)
    .setScale(0.8);
  var baixo = this.add
    .image(290, 360, "setas", 4)
    .setInteractive()
    .setScrollFactor(0)
    .setScale(0.8);

  //socket = io("https://still-tundra-75872.herokuapp.com/");
  socket = io()
/*
  //Parte da imagem de explicação - princesa
  var eprincesa = this.add.image(480, 270, "eprincesa", 0);

  next = this.add.image(870, 450, "next").setInteractive();

  function desaparecerbotaonext() {
    next.setVisible(false);
  }

  next.on("pointerdown", function () {
    eprincesa.setVisible(false);
    desaparecerbotaonext();
  });

  //Parte da imagem de explicação - princesa
  var ebruxa = this.add.image(480, 270, "ebruxa", 0);

  next = this.add.image(870, 450, "next").setInteractive();

  function desaparecerbotaonext() {
    next.setVisible(false);
  }

  next.on("pointerdown", function () {
    ebruxa.setVisible(false);
    desaparecerbotaonext();
  });*/

  var physics = this.physics;
  var cameras = this.cameras;
  var waiting = this.add.image(480, 270, "waiting", 0);

  botao1 = this.add.image(180, 400, "sala1").setInteractive();
  botao2 = this.add.image(330, 400, "sala2").setInteractive();
  botao3 = this.add.image(480, 400, "sala3").setInteractive();
  botao4 = this.add.image(630, 400, "sala4").setInteractive();
  botao5 = this.add.image(780, 400, "sala5").setInteractive();

  function desaparecerbotaosala() {
    botao1.setVisible(false);
    botao2.setVisible(false);
    botao3.setVisible(false)
    botao4.setVisible(false);
    botao5.setVisible(false);
  }

  botao1.on("pointerdown", function () {
    sala = 1;
    socket.emit("entrar-na-sala", sala);
    cameras.main.setZoom(2);
    waiting.setVisible(false);
    desaparecerbotaosala();
  });
  botao2.on("pointerdown", function () {
    sala = 2;
    socket.emit("entrar-na-sala", sala);
    cameras.main.setZoom(2);
    waiting.setVisible(false);
    desaparecerbotaosala();
  });
  botao3.on("pointerdown", function () {
    sala = 3;
    socket.emit("entrar-na-sala", sala);
    cameras.main.setZoom(2);
    waiting.setVisible(false);
    desaparecerbotaosala();
  });
  botao4.on("pointerdown", function () {
    sala = 4;
    socket.emit("entrar-na-sala", sala);
    cameras.main.setZoom(2);
    waiting.setVisible(false);
    desaparecerbotaosala();
  });
  botao5.on("pointerdown", function () {
    sala = 5;
    socket.emit("entrar-na-sala", sala);
    cameras.main.setZoom(2);
    waiting.setVisible(false);
    desaparecerbotaosala();
  });

  socket.on("jogadores", (jogadores) => {
    if (jogadores.primeiro === socket.id) {
      // Define jogador como o primeiro
      jogador = 1;

      // Personagens colidem com os limites da cena
      player1.setCollideWorldBounds(true);

      // Detecção de colisão: terreno
      physics.add.collider(player1, labirinto, hitTiles, null, this);
      physics.add.collider(player1, chao, null, null, this);

      // Câmera seguindo o personagem 1
      cameras.main.startFollow(player1);

      placarVida.setVisible(false);
      //explicaprin.setVisible(false);

      // D-pad: para cada direção já os eventos
      // para tocar a tela ("pointerover")
      // e ao terminar essa interação ("pointerout")
      esquerda.on("pointerover", () => {
        if (online) {
          esquerda.setFrame(1);
          player1.setVelocityX(-160);
          player1.anims.play("left", true);
        }
      });
      esquerda.on("pointerout", () => {
        if (online) {
          esquerda.setFrame(0);
          player1.setVelocityX(0);
          player1.anims.play("turn", true);
        }
      });
      direita.on("pointerover", () => {
        if (online) {
          direita.setFrame(3);
          player1.setVelocityX(160);
          player1.anims.play("right", true);
        }
      });
      direita.on("pointerout", () => {
        if (online) {
          direita.setFrame(2);
          player1.setVelocityX(0);
          player1.anims.play("turn", true);
        }
      });
      cima.on("pointerover", () => {
        if (online) {
          cima.setFrame(7);
          player1.setVelocityY(-160);
          player1.anims.play("up", true);
        }
      });
      cima.on("pointerout", () => {
        if (online) {
          cima.setFrame(6);
          player1.setVelocityY(0);
          player1.anims.play("turn", true);
        }
      });
      baixo.on("pointerover", () => {
        if (online) {
          baixo.setFrame(5);
          player1.setVelocityY(160);
          player1.anims.play("down", true);
        }
      });
      baixo.on("pointerout", () => {
        if (online) {
          baixo.setFrame(4);
          player1.setVelocityY(0);
          player1.anims.play("down", true);
        }
      });

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
      physics.add.collider(player2, chao, null, null, this);

      // Câmera seguindo o personagem 2
      cameras.main.startFollow(player2);

      // D-pad: para cada direção já os eventos
      // para tocar a tela ("pointerover")
      // e ao terminar essa interação ("pointerout")
      esquerda.on("pointerover", () => {
        if (online) {
          esquerda.setFrame(1);
          player2.setVelocityX(-160);
          player2.anims.play("left2", true);
        }
      });
      esquerda.on("pointerout", () => {
        if (online) {
          esquerda.setFrame(0);
          player2.setVelocityX(0);
          player2.anims.play("turn2", true);
        }
      });
      direita.on("pointerover", () => {
        if (online) {
          direita.setFrame(3);
          player2.setVelocityX(160);
          player2.anims.play("right2", true);
        }
      });
      direita.on("pointerout", () => {
        if (online) {
          direita.setFrame(2);
          player2.setVelocityX(0);
          player2.anims.play("turn2", true);
        }
      });
      cima.on("pointerover", () => {
        if (online) {
          cima.setFrame(7);
          player2.setVelocityY(-160);
          player2.anims.play("up2", true);
        }
      });
      cima.on("pointerout", () => {
        if (online) {
          cima.setFrame(6);
          player2.setVelocityY(0);
          player2.anims.play("turn2", true);
        }
      });
      baixo.on("pointerover", () => {
        if (online) {
          baixo.setFrame(5);
          player2.setVelocityY(160);
          player2.anims.play("down2", true);
        }
      });
      baixo.on("pointerout", () => {
        if (online) {
          baixo.setFrame(4);
          player2.setVelocityY(0);
          player2.anims.play("turn2", true);
        }
      });

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
              socket.emit("candidate", sala, candidate);
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
                sala,
                localConnection.localDescription
              );
            });
        })
        .catch((error) => console.log(error));
    }

    // Os dois jogadores estão conectados
    console.log(jogadores);

    if (jogadores.primeiro !== undefined && jogadores.segundo !== undefined) {
      online = true
    }
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
        socket.emit("answer", sala, remoteConnection.localDescription);
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

  socket.on("fim-de-jogo", ({ vencedor }) => {
    if (vencedor === "mocinha") {
      this.scene.start(cena3);
      socket.close();
    } else if (vencedor === "assassino") {
      this.scene.start(cena2);
      socket.close();
    }
  });
};

cena1.update = function () {
  if (gameOver) {
    this.scene.start(cena2);
  }
  if (jogador === 1 && vida >= 0) {
    socket.emit("estadoDoJogador", sala, {
      frame: player1.anims.getFrameName(),
      x: player1.body.x + 16,
      y: player1.body.y + 24,
    });

  } else if (jogador === 2 && vida >= 0) {
    socket.emit("estadoDoJogador", sala, {
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
  placarVida.setFrame(3 - vida);
  console.log(vida, 3 - vida);
  player2.x = 150;
  player2.y = 90;

  if (vida === 0) {
    gameOver = true;
  }
}

function collectChave(player2, anoes) {
  //faca some quando coletada
  anoes.disableBody(true, true);

  inventory += 1;
  personagem_com_faca = true;
  console.log("Personagem com faca? %s", personagem_com_faca);
  socket.emit("inventario", sala, { faca: true });
}

export { cena1 };

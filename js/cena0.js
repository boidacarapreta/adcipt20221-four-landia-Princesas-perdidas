// Importar a próxima cena
import { cena1 } from "./cena1.js";

// Criar a cena 0
var cena0 = new Phaser.Scene("Cena 0");

cena0.preload = function () {
  // Imagem de fundo
  this.load.image("abertura", "assets/cena0.jpg");
  
  this.load.image("botao", "assets/botao3.png");
  
  this.load.spritesheet("telacheia", "assets/telacheia2.png", {
    frameWidth: 50,
    frameHeight: 52,
  });
};

cena0.create = function () {
  this.add.image(480, 270, "abertura", 0);

  var button = this.add.image(480, 480, "botao", 0).setInteractive();
  // Ao clicar no botão, inicia a cena 1
  button.on(
    "pointerdown",
    function () {
      this.scene.start(cena1);
    },
    this
  );
  
  var button2 = this.add
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
};

cena0.update = function () {};

// Exportar a cena
export { cena0 };

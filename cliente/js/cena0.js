// Importar a próxima cena
import { cena3 } from "./cena3.js";

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
  // Botão com a imagem de fundo
  var button = this.add.image(480, 480, "botao", 0).setInteractive();

  this.add.image(50, 500, "telacheia", 0).setInteractive();
  
  // Ao clicar no botão, inicia a cena 1
  button.on(
    "pointerdown",
    function () {
      this.scene.start(cena3);
    },
    this
  );
};

cena0.update = function () {};

// Exportar a cena
export { cena0 };

// Importar a próxima cena
import { cena4 } from "./cena4.js";

// Criar a cena 0
var cena0 = new Phaser.Scene("Cena 0");

cena0.preload = function () {
  // Imagem de fundo
  this.load.image("abertura", "assets/cena0.jpg");
};

cena0.create = function () {
  // Botão com a imagem de fundo
  var button = this.add.image(480, 270, "abertura", 0).setInteractive();

  // Ao clicar no botão, inicia a cena 1
  button.on(
    "pointerdown",
    function () {
      this.scene.start(cena4);
    },
    this
  );
};

cena0.update = function () {};

// Exportar a cena
export { cena0 };

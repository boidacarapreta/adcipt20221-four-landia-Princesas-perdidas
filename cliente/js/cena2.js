// Importar a próxima cena
import { cena3 } from "./cena3.js";

// Criar a cena 2
var cena2 = new Phaser.Scene("Cena 2");

cena2.preload = function () {
  // Imagem de fundo
  this.load.image("fim", "assets/cenafinal.jpg");
};

cena2.create = function () {
  // Botão com a imagem de fundo
  var button = this.add.image(400, 300, "fim", 0).setInteractive();

  // Ao clicar no botão, volta para a cena 1
  button.on(
    "pointerdown",
    function () {
      this.scene.start(cena0);
    },
    this
  );
};

cena2.update = function () {};

// Exportar a cena
export { cena2 };

// Importar a próxima cena
import { cena1 } from "./cena1.js";

// Criar a cena 2
var cena2 = new Phaser.Scene("cena 2");

cena2.preload = function () {
  // Imagem de fundo
  this.load.image("fim", "assets/cenafinal.jpg");

  this.load.image("botao", "assets/play.png");
};

cena2.create = function () {
  // Botão com a imagem de fundo
  this.add.image(480, 270, "fim");

  var button = this.add.image(480, 480, "botao").setInteractive();

  // Ao clicar no botão, volta para a cena 1
  button.on(
    "pointerdown",
    function () {
      this.scene.start(cena1);
    },
    this
  );
};

cena2.update = function () {};

// Exportar a cena
export { cena2 };

// Importar a próxima cena
import { cena1 } from "./cena1.js";

// Criar a cena 3
var cena3 = new Phaser.Scene("cena 3");

cena3.preload = function () {
    // Imagem de fundo
    this.load.image("perda", "assets/perda.png");

    this.load.image("botao", "assets/play.png");
};

cena3.create = function () {
    // Botão com a imagem de fundo
    this.add.image(480, 270, "perda", 0);

    var button = this.add.image(840, 470, "botao")
        .setInteractive()
        .setScale(0.7);

    // Ao clicar no botão, volta para a cena 1
    button.on(
        "pointerdown",
        function () {
            this.scene.start(cena1);
        },
        this
    );
};

cena3.update = function () { };

// Exportar a cena
export { cena3 };
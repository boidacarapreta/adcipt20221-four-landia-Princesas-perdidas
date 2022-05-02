// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 3
var cena3 = new Phaser.Scene("Cena 3");

var tileset0;
var map;

cena3.preload = function () {
this.load.image("tilesset0", "assets/terreno.png");
this.load.tilemapTiledJSON("map", "assets/teste4.json");
this.load.spritesheet("branca", "assets/brancadeneve.png", {
  frameWidth: 32,
  frameHeight: 48,
});
}

cena3.create = function () {
const map = this.make.tilemap({ key: "map" });

// Primeira "tileset0" é o nome que está no tiled
// Segundo "tileset0" é a key do preload
const tileset = map.addTilesetImage("tileset0", "tileset0");

// Parameters: layer name (or index) from Tiled, tileset, x, y
const belowLayer = map.createStaticLayer("chao", tileset, 0, 0);
const worldLayer = map.createStaticLayer("labirinto", tileset, 0, 0);

worldLayer.setCollisionBetween(259);
worldLayer.setCollisionByProperty({ collides: true });


}

cena3.update = function () { }

export { cena3 };

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        this.load.image('bomb', '/images/bomb.png');
        this.load.image('background', '/images/background.png');
        this.load.image('shooter', '/images/Plant.png');
        this.load.image('brawler', '/images/Bonk.png');
        this.load.image('donut', '/images/Donut.png');
        this.load.image('heartfull', '/images/heartemty.png');
        this.load.image('heartempty', '/images/heartfull.png');
        this.load.image('Door', '/images/Door.png');
        this.load.image('health', '/images/Health.png')
        this.load.spritesheet('dude', '/images/dude.png', { frameWidth: 32, frameHeight: 48 }, );
        this.load.spritesheet('button', '/images/Button.png', { frameWidth: 26, frameHeight: 28 }, );
        // här laddar vi in en tilemap med spelets "karta"
        this.load.image('tiles', '/tilesets/jefrens_tilesheet.png');
        //this.load.tilemapTiledJSON('map', '/tilemaps/level1.json');
        //this.load.tilemapTiledJSON('map', '/tilemaps/Traintest.json');
        this.load.tilemapTiledJSON('map', '/tilemaps/Train.json');

        this.load.audio('doh', '/audio/Doh.mp3');
        
    }

    create() {
        this.scene.start('PlayScene');
    }
}

export default PreloadScene;
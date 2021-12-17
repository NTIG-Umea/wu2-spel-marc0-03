class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // säg åt phaser att lägga till /assets i alla paths
        this.load.setBaseURL('/assets');
        this.load.image('background', '/images/Background.png');
        this.load.image('shooter', '/images/Snogubbe.png');
        this.load.image('brawler', '/images/Bonk.png');
        this.load.image('donut', '/images/Donut.png');
        this.load.image('heartfull', '/images/heartemty.png');
        this.load.image('heartempty', '/images/heartfull.png');
        this.load.image('snoboll', '/images/Snoboll.png')
        this.load.image('Door', '/images/Door.png');
        this.load.image('health', '/images/Health.png')
        this.load.image('empty', '/images/empty.png')
        this.load.image('boss', '/images/Boss.png')
        this.load.spritesheet('dude', '/images/dude.png', { frameWidth: 32, frameHeight: 48 }, );
        this.load.spritesheet('button', '/images/Button.png', { frameWidth: 26, frameHeight: 28 }, );
        this.load.spritesheet('Powerups', '/images/Powerups.png', { frameWidth: 71, frameHeight: 64 }, );

        this.load.image('paket1', '/images/Paket.png')
        this.load.image('paket2', '/images/Paket2.png')
        this.load.image('paket3', '/images/Paket3.png')

        this.load.image('Mountain1', '/images/Mountain1.png')
        this.load.image('Mountain2', '/images/Mountain2.png')
        this.load.image('Mountain3', '/images/Mountain3.png')

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
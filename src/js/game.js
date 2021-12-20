// importera alla scener
import PlayScene from './play-scene';
import PlayScene2 from './play-scene2';
import PlayScene3 from './play-scene3';
import PlayScene4 from './play-scene4';
import PreloadScene from './preload-scene';

// spelets config
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 550,
    pixelArt: true,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [PreloadScene, PlayScene, PlayScene2, PlayScene3, PlayScene4],
    parent: 'game'
};

// initiera spelet
new Phaser.Game(config);

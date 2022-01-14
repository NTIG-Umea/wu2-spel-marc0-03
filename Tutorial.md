## Raycasting with tilemaps
https://newdocs.phaser.io/docs/3.54.0/focus/Phaser.Tilemaps.Tilemap-getTilesWithinShape

this.platforms is the tilemap
```js
let line = new Phaser.Geom.Line(x, y, child.x, child.y);  
let overlappingTiles = this.platforms.getTilesWithinShape(line, { isColliding: true });
```

#### overlappingTiles.length is the amount of tiles the line is colliding with, this is a little *wonky* att times.
if you want to check if one thing can **see** another then check that overlappingTiles.length == 0

## Send data Between Scenes

When u start a new scene use
```js
change(){
this.scene.pause()
this.scene.launch('PlayScene2', {Thing: this.thing });
}
```
  
**V V V** and in the new scene do this below before create **V V V**  

```js
var newThing;   
class PlayScene2 extends Phaser.Scene {     
  constructor() {     
    super('PlayScene2');      
   }   
   init(data)    
    {   
        newThing = data.Thing;   
    }
```

![Idk](https://user-images.githubusercontent.com/60389027/149496116-6e4db280-a964-438d-a382-be741d956c86.png)
![Idk](https://user-images.githubusercontent.com/60389027/149496000-d8a30997-3851-47d2-aca8-3ab9e452de5f.png)

## Data in ojects
You can give things data
```js
this.player.setDataEnabled();
            this.player.setData({
                iFrames: 80,
                maxFrames: 80,
                health: 6,
                maxhealth: 6,
                donutCooldown: 40,
                donutTimer: 0,
                donutScale: 0.5,
                donutAim: 18,
                donutGrav: 300,
                donutBounce: 0.8,
                damage: 10,
                time: 140,
                donutSpeed: 550,
                speed: 250,
                jumpHeight: -500,
                jumps: 1,
                jumpsMax: 1,
                donutSplits: 1,
                shots: 1
            });
```
and then access and change that data
```js
if (this.player.getData('jumps') != 0 && !this.player.body.onFloor()) {
                this.player.setVelocityY(this.player.getData('jumpHeight'));
                this.player.setData('jumps', this.player.getData('jumps') - 1)
            }
```
    

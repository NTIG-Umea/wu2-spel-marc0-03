var maped;
class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.gameOver = false;
        this.physics.world.setBounds(0,0,3044, 608)

        this.right = true;
        this.doh = this.sound.add('doh');
        //this.doh.play();

        //  A simple background for our game
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(3.5,1.3);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });

        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('32Tileset', 'tiles');
        this.Started = false;

        this.tilebackground = map.createLayer('Background', tileset);

        map.getObjectLayer('StartDoor').objects.forEach((StartDoor) => {
            this.StartDoor = this.physics.add.sprite(StartDoor.x, StartDoor.y - StartDoor.height, 'Door').setScale(0.5,0.5);
            this.StartDoor.body.immovable = true;
        });

        maped = map;

        this.platforms = map.createLayer('Platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);


        // The player and its settings
        this.player = this.physics.add.sprite(50, 280, 'dude');

        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(300)
        this.player.setDataEnabled();
        this.player.setData({ iFrames: 80, health: 6, maxhealth: 6, donutCooldown: 40, donutTimer: 40, damage: 10, time: 140 });
        //donutCooldown is the amount of time it takes to reaload
        //donutTimer is the thing that is counting down

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.1,0.1);
        this.cameras.main.setSize(1150,600)
        this.cameras.main.setBounds(0,0,3044, 608)
        

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyObj = this.input.keyboard.addKey('Z', true, false);

        this.donuts = this.physics.add.group({
        });

        this.Shooters = this.physics.add.group({
        })

        this.brawlers = this.physics.add.group({
        })

        this.bombs = this.physics.add.group({
        })

        this.pickups = this.physics.add.group({
        })

        map.getObjectLayer('Door').objects.forEach((Door) => {
            this.Door = this.physics.add.sprite(Door.x, Door.y - Door.height-32, 'Door').setScale(0.5,1);
            this.Door.body.immovable = true;
        });

        map.getObjectLayer('StartButton').objects.forEach((StartButton) => {
            this.StartButton = this.physics.add.sprite(StartButton.x-12, StartButton.y - StartButton.height, 'button').setScale(1);
            this.StartButton.body.immovable = true;
        });
        map.getObjectLayer('StartZone').objects.forEach((StartZone) => {
            this.StartZone = this.physics.add.sprite(StartZone.x, StartZone.y+StartZone.height/2, 'empty').setSize(1,StartZone.height);
            this.StartZone.body.immovable = true;
        });

        this.buttonPressed = false

        
        this.createAnims();

        this.graphics = this.add.graphics({
            lineStyle: { width: 1, color: 0x03a8fff2 },
        });
    
        

        this.lifesText = this.add.text(16, 16, 'lifes: 6 / 6', { fontSize: '32px', fill: '#00FF00' });
        this.lifesText.setScrollFactor(0);

        this.physics.add.collider(this.Shooters, this.platforms);
        this.physics.add.collider(this.donuts, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.pickups, this.platforms);
        this.physics.add.collider(this.player, this.StartDoor);
        this.physics.add.collider(this.player, this.Door);

        this.physics.add.overlap(this.player, this.StartZone, this.start, null, this);

        this.physics.add.collider(this.bombs, this.platforms, this.destroyBullet, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.hitPlayerBomb, null, this);
        this.physics.add.overlap(this.player, this.Shooters, this.hitPlayerShooter, null, this);
        this.physics.add.overlap(this.player, this.brawlers, this.hitPlayerBrawler, null, this);
        this.physics.add.overlap(this.donuts, this.Shooters, this.hitShooter, null, this);
        this.physics.add.overlap(this.donuts, this.brawlers, this.hitBrawler, null, this);
        this.physics.add.overlap(this.donuts, this.StartButton, this.hitButton, null, this);
        
        this.physics.add.overlap(this.player, this.pickups, this.pickuped, null, this);
    }

    update() {
        this.Iframes();
        this.background.x-=1;
        if (this.buttonPressed) {
            this.StartButton.anims.play('Pressed', true);
        } else {
            this.StartButton.anims.play('unPressed', true);
        }

        if (this.cursors.left.isDown && this.cursors.right.isDown) {
            if (this.player.body.onFloor()) {
                if (this.player.body.velocity.x > 0) {
                    this.player.setVelocityX(this.player.body.velocity.x - 40);
                }
                else if (this.player.body.velocity.x < 0) {
                    this.player.setVelocityX(this.player.body.velocity.x + 40);
                }

            }
            this.player.anims.play('turn', true);
        } else if (this.cursors.left.isDown) {
            this.right = false;
            if (this.player.body.velocity.x >= -360 && this.player.body.onFloor()) {
                this.player.setVelocityX(this.player.body.velocity.x - 40);
            }


            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.right = true;
            if (this.player.body.velocity.x <= 360 && this.player.body.onFloor()) {
                this.player.setVelocityX(this.player.body.velocity.x + 40);
            }

            this.player.anims.play('right', true);
        } else {
            if (this.player.body.onFloor()) {
                if (this.player.body.velocity.x > 0) {
                    this.player.setVelocityX(this.player.body.velocity.x - 40);
                } else if (this.player.body.velocity.x < 0) {
                    this.player.setVelocityX(this.player.body.velocity.x + 40);
                }
            }
            this.player.anims.play('turn', true);
        }

        if (this.cursors.space.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-330);

        }
        
        if (this.cursors.down.isDown) {
        }

        if (this.keyObj.isDown) {
            if (this.player.getData('donutTimer') >= this.player.getData('donutCooldown')) {
                this.donut = this.donuts.create(this.player.body.x, this.player.body.y, 'donut');
                this.donut.setScale(0.5)
                if (this.right) {
                    this.donut.body.velocity.x = 500;
                    this.donut.angle = 270;
                } else {
                    this.donut.body.velocity.x = -500;
                    this.donut.angle = 90;
                }
                if (this.cursors.up.isDown) {
                    this.donut.body.velocity.y = -200;
                } else if (this.cursors.down.isDown){
                    this.donut.body.velocity.y = 200;
                }
                this.donut.setBounce(0.8);
                this.donut.setGravityY(300);
                this.donut.setDataEnabled();
                this.donut.setData({ time: this.player.getData('time'), damage: this.player.getData('damage') });
                this.player.setData('donutTimer', 0)
                console.log("damage =" + this.donut.getData('damage'))
            }
        }

        if (this.player.getData('donutTimer') != this.player.getData('donutCooldown')) {
            this.player.setData('donutTimer', this.player.getData('donutTimer') + 1);
        }

        //var player = this.player.body.y
        var right = this.right
        var x = this.player.body.x;
        var y = this.player.body.y;
        var width = this.player.body.width;
        var height = this.player.body.height;

        var bombs = this.bombs;
        var dis = this;
        this.brawlers.children.iterate(function (child) {
            if ((child.body.x>x && right) || (child.body.x<x && !right)) {

                child.body.velocity.x *= 0.97;
                child.body.velocity.y *= 0.97;
                child.alpha=0.25;
            } else {
                let angle = Math.atan2((y - child.body.y), (x - child.body.x))
                child.body.setVelocityX(Math.cos(angle) * 200)
                child.body.setVelocityY(Math.sin(angle) * 200)
                child.alpha=1;
            }
        })
        this.Shooters.children.iterate(function (child) {
            var num = dis.Raycast(x,y,width,height,child);
            if (child.getData('time')>=100 && num==0) {
                if (child.getData('type')==1) {
                let angle = Math.atan2((y-child.body.y),(x-child.body.x))
                var bomb = bombs.create(child.body.x+32, child.body.y+32, 'bomb');
                let speed = 500;
                bomb.setDataEnabled();
                bomb.setData({time: 100, type: 1});
                bomb.setVelocityX(Math.cos(angle)*speed)
                bomb.setVelocityY(Math.sin(angle)*speed)
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
                } else if (child.getData('type')==2) {
                    for (let i = 0; i<3; i++) {
                let angle = Math.atan2((y-child.body.y),(x-child.body.x)+(i*0.1-0.1))
                var bomb = bombs.create(child.body.x+32, child.body.y+32, 'bomb');
                let speed = 500;
                bomb.setDataEnabled();
                bomb.setData({time: 100, type: 1});
                bomb.setVelocityX(Math.cos(angle)*speed)
                bomb.setVelocityY(Math.sin(angle)*speed)
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
                    }
                }
                child.data.values.time=0;
            } else {
                child.data.values.time += 1;
            }
        })


        if (this.bombs.countActive(true) != 0) {
            this.bombs.children.iterate(function (child) {
                if (child != null) {
                    if (child.getData('time') == 0) {
                        child.destroy();
                    } else {
                        child.data.values.time -= 1;
                    }
                }
            })
        }

        if (this.donuts.countActive(true) != 0) {
            this.donuts.children.iterate(function (child) {
                if (child != null) {
                    if (child.getData('time') == 0) {
                        child.destroy();
                    } else {
                        child.setData('time', child.getData('time') - 1);
                    }
                }
            })
        }

        if (this.pickups.countActive(true) != 0) {
            this.pickups.children.iterate(function (child) {
                if (child != null) {
                    if (child.getData('time') == 0) {
                        child.destroy();
                    } else {
                        child.setData('time', child.getData('time') - 1);
                        child.alpha=child.getData('time')/300
                    }
                }
            })
        }


        if (this.Shooters.countActive(true)==0 && this.brawlers.countActive(true)==0 && this.Started) {
            this.Door.destroy();
        }
    }

    Iframes() {
        this.player.tint = Phaser.Display.Color.GetColor(100 * (this.player.data.values.iFrames / 80) + 155, 100 * (this.player.data.values.iFrames / 80) + 155, 155 * (this.player.data.values.iFrames / 80) + 100);
        if (this.player.getData('iFrames') != 80) {
            this.player.setData('iFrames', this.player.getData('iFrames') + 1);
        }
    }

    /*
    // för pause
    if (this.keyObj.isDown) {
        // pausa nuvarande scen
        this.scene.pause();
        // starta menyscenene
        this.scene.launch('MenuScene');
    }
    */
   hitButton(donut, _button) {
    donut.setData('time', 0);
    this.buttonPressed=true;
    //this.StartDoor.disableBody(true, true);
    this.tweens.add({
        targets: this.StartDoor,
        y: 416,
        duration: 200,
        //ease: 'Sine.easeInOut',
        //repeat: -1,
        //yoyo: true
    });
   }
   destroyBullet(bomb, _platform) {
       bomb.destroy();
   }

    hitShooter(donut, shooter) {
        shooter.setData('health', shooter.getData('health') - donut.getData('damage'))
        if (shooter.getData('health') <= 0) {
                this.spawnHealth(shooter);
            shooter.destroy();
        }
        donut.setData('time', 0);
    };
    hitBrawler(donut, brawler) {
        brawler.data.values.health -= donut.getData('damage');
        if (brawler.getData('health') <= 0) {
            this.spawnHealth(brawler);

            brawler.destroy();
        }
        donut.setData('time', 0);
    };

    hitPlayerBomb(player, bomb) {
        bomb.data.values.time = 0;
        this.hitPlayer(player);

    };
    hitPlayerShooter(player, _shooter) {
        this.hitPlayer(player);
    };
    hitPlayerBrawler(player, _brawler) {
        this.hitPlayer(player);
    };
    hitPlayer(player){
        if (player.getData('iFrames') == 80) {
            player.data.values.health -= 1;
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);
            if (player.data.values.health <= 0) {
                player.setTint(0xff0000);
                this.physics.pause();

                player.anims.play('turn');

                this.gameOver = true;
            }
            player.data.values.iFrames = 0;
        }
    };

    pickuped(player, pickup) {
        if (player.getData('health')!=player.getData('maxhealth')) {
            player.setData('health', player.getData('health')+pickup.getData('health'));
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);
            pickup.destroy();
        }
    }
    
    spawnHealth(location){
        if (Phaser.Math.FloatBetween(0,1)>0.1) {
        var Health = this.pickups.create(location.x, location.y, 'health').setScale(0.5);
        Health.setDataEnabled();
        Health.setData({health: 1,time: 300 });
        Health.setGravityY(300)
        }
    }
    createAnims(){
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'unPressed',
            frames: [{ key: 'button', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'Pressed',
            frames: [{ key: 'button', frame: 1 }],
            frameRate: 20
        });
    }
    Raycast(x,y,width,height, child) {
        let line = new Phaser.Geom.Line( x, y, child.x, child.y-16);
        let line2 = new Phaser.Geom.Line( x+ width,  y+ height, child.x, child.y+16);
        let line3 = new Phaser.Geom.Line( x,  y+ height, child.x, child.y-16);
        let line4 = new Phaser.Geom.Line( x+ width,  y, child.x, child.y+16);
        let overlappingTiles = this.platforms.getTilesWithinShape(line, { isColliding: true });
        let overlappingTiles2 = this.platforms.getTilesWithinShape(line2, { isColliding: true });
        let overlappingTiles3 = this.platforms.getTilesWithinShape(line3, { isColliding: true });
        let overlappingTiles4 = this.platforms.getTilesWithinShape(line4, { isColliding: true });
        return overlappingTiles.length + overlappingTiles2.length + overlappingTiles3.length + overlappingTiles4.length; 
    }
    start(player, StartZone){
        this.tweens.add({
            targets: this.StartDoor,
            y: 480,
            duration: 50,
            ease: 'Sine.easeInOut',
            //repeat: -1,
            //yoyo: true
        });
        maped.getObjectLayer('Brawlers').objects.forEach((Brawler) => {
            this.brawler = this.brawlers.create(Brawler.x, Brawler.y, 'brawler').setScale(0.5);
            this.brawler.setVelocityX(0);
            this.brawler.setVelocityY(0);
            this.brawler.setDataEnabled();
            this.brawler.setData({ health: 20 });
        });
        maped.getObjectLayer('Shooters').objects.forEach((shooter) => {
            // iterera över spikarna, skapa spelobjekt
            this.shooter = this.Shooters.create(shooter.x, shooter.y - shooter.height, 'shooter');
            this.shooter.setDataEnabled();
            this.shooter.body.setGravityY(300);
            if(shooter.type==0) {
            this.shooter.setData({ time: Phaser.Math.FloatBetween(0,100), type: 1, health: 10 });
        } else {
            this.shooter.setData({ time: 0, type: 2, health: 10 });
            this.shooter.setTint(0x0000ff)
        }
        });


        StartZone.destroy();
        this.Started=true;
    }
}

export default PlayScene;

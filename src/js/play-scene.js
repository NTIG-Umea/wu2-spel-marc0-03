class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.bombs;
    }

    create() {
        this.gameOver = false;
        this.physics.world.setBounds(0,0,2560, 608)

        this.right = true;
        this.doh = this.sound.add('doh');
        //this.doh.play();

        //  A simple background for our game
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(3,1.3);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });

        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('32Tileset', 'tiles');

        this.platforms = map.createLayer('Platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);


        // The player and its settings
        this.player = this.physics.add.sprite(50, 280, 'dude');

        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(300)
        this.player.setDataEnabled();
        this.player.setData({ iFrames: 80, health: 6, donutCooldown: 40, donutTimer: 40, damage: 10, time: 140 });
        //donutCooldown is the amount of time it takes to reaload
        //donutTimer is the thing that is counting down

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(1,1);
        this.cameras.main.setSize(800,600)
        this.cameras.main.setBounds(0,0,2560,608)


        //  Our player animations, turning, walking left and walking right.
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

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyObj = this.input.keyboard.addKey('Z', true, false);

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis

        this.donuts = this.physics.add.group({
        });

        this.Shooters = this.physics.add.group({
        })

        this.brawlers = this.physics.add.group({
        })

        this.bombs = this.physics.add.group({
        })

        map.getObjectLayer('Shooters').objects.forEach((shooter) => {
            // iterera över spikarna, skapa spelobjekt
            this.shooter = this.Shooters.create(shooter.x, shooter.y - shooter.height, 'shooter');
            this.shooter.setDataEnabled();
        this.shooter.setData({ time: 0, type: 1, health: 10 });
        });
        map.getObjectLayer('Door').objects.forEach((Door) => {
            this.Door = this.physics.add.sprite(Door.x, Door.y - Door.height-32, 'Door').setScale(0.5,1);
            this.Door.body.imovable = true;
            //this.Door.body.moves = false;
        });

        this.shooter = this.Shooters.create(this.player.body.x + 100, this.player.body.y - 50, 'shooter');
        this.shooter.setDataEnabled();
        this.shooter.setData({ time: 0, type: 1, health: 10 });
        this.brawler = this.brawlers.create(800, 300, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 20 });

        this.lifesText = this.add.text(16, 16, 'lifes: 6', { fontSize: '32px', fill: '#00FF00' });
        this.lifesText.setScrollFactor(0);


        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.Shooters, this.platforms);
        this.physics.add.collider(this.donuts, this.platforms);
        this.physics.add.collider(this.player, this.platforms);

        this.physics.add.overlap(this.player, this.bombs, this.hitPlayerBomb, null, this);
        this.physics.add.overlap(this.player, this.Shooters, this.hitPlayerShooter, null, this);
        this.physics.add.overlap(this.player, this.brawlers, this.hitPlayerBrawler, null, this);
        this.physics.add.overlap(this.donuts, this.Shooters, this.hitShooter, null, this);
        this.physics.add.overlap(this.donuts, this.brawlers, this.hitBrawler, null, this);
    }

    update() {
        this.player.tint = Phaser.Display.Color.GetColor(100 * (this.player.data.values.iFrames / 80) + 155, 100 * (this.player.data.values.iFrames / 80) + 155, 155 * (this.player.data.values.iFrames / 80) + 100)
        if (this.player.getData('iFrames') != 80) {
            this.player.setData('iFrames', this.player.getData('iFrames') + 1);
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
        
        /*
        if (this.cursors.space.isDown) {
            this.shooter = this.Shooters.create(this.player.body.x + 100, this.player.body.y, 'shooter');
            this.shooter.body.setGravityY(300);
            this.shooter.setDataEnabled();
            if (Phaser.Math.FloatBetween(0, 1) >= 0.5) {
                this.shooter.setData({ time: 0, type: 2, health: 10 });
                this.shooter.setTint(0x0000ff)
            } else {
                this.shooter.setData({ time: 0, type: 1, health: 10 });
            }
            console.log("health =" + this.shooter.getData('health'))
        }
        */
        if (this.cursors.down.isDown) {
            console.log(this.Shooters.countActive(true), this.brawlers.countActive(true))
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

        var x = this.player.body.x
        var y = this.player.body.y
        this.brawlers.children.iterate(function (child) {
            let angle = Math.atan2((y - child.body.y), (x - child.body.x))
            child.body.setVelocityX(Math.cos(angle) * 50)
            child.body.setVelocityY(Math.sin(angle) * 50)
        })
        var bombs = this.bombs;
        this.Shooters.children.iterate(function (child) {
            if (child.getData('time')==100) {
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

        if (this.Door.is != null && this.Shooters.countActive(true)==0 && this.brawlers.countActive(true)==0) {
            console.log("Yea")
            this.Door.destroy();
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

    hitShooter(donut, shooter) {
        console.log("health =" + shooter.getData('health') + " damage = " + donut.getData('damage'))
        shooter.setData('health', shooter.getData('health') - donut.getData('damage'))
        console.log(shooter)
        if (shooter.getData('health') <= 0) {
            shooter.destroy();
        }
        donut.setData('time', 0);
    };
    hitBrawler(donut, brawler) {
        brawler.data.values.health -= donut.getData('damage');
        if (brawler.getData('health') <= 0) {
            brawler.destroy();
        }
        donut.setData('time', 0);
    }

    hitPlayerBomb(player, bomb) {
        bomb.data.values.time = 0;
        this.hitPlayer(player);

    }
    hitPlayerShooter(player, _shooter) {
        this.hitPlayer(player);
    }
    hitPlayerBrawler(player, _brawler) {
        this.hitPlayer(player);
    }
    hitPlayer(player){
        if (player.getData('iFrames') == 80) {
            player.data.values.health -= 1;
            this.lifesText.setText("lifes: " + player.data.values.health);
            if (player.data.values.health == 0) {
                this.physics.pause();

                player.setTint(0xff0000);
                player.anims.play('turn');

                this.gameOver = true;
            }
            player.data.values.iFrames = 0;
        }
    }
}

export default PlayScene;

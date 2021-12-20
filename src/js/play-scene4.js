var maped;
var tilesete
var tempplayer
class PlayScene4 extends Phaser.Scene {
    constructor() {
        super('PlayScene4');
    }
    init(data)
    {
        console.log(data.player)
        tempplayer = data.player;
        console.log(this.player)
    }

    

    create() {
        console.log(this.scenetest)
        this.gameOver = false;
        this.right = true;
        this.physics.world.setBounds(0, 0, 4768, 608)

        this.doh = this.sound.add('doh');

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.32);
        this.background.setScrollFactor(0)

        this.createMountains();
        const map = this.make.tilemap({ key: "map4", tileWidth: 16, tileHeight: 16 });
        const tileset = map.addTilesetImage('32Tileset', 'tiles');
        const tileset2 = map.addTilesetImage('train-tileset-outside', 'tiles2');
        const tileset3 = map.addTilesetImage('train-tileset-new', 'tiles3');
        this.Started = false;

        this.tilebackground2 = map.createLayer('Background', tileset3);

        this.tilebackground = map.createLayer('Background2', tileset2);

        map.getObjectLayer('StartDoor').objects.forEach((StartDoor) => {
            this.StartDoor = this.physics.add.sprite(StartDoor.x, StartDoor.y - StartDoor.height, 'Door').setScale(0.5, 0.5);
            this.StartDoor.body.immovable = true;
        });
        this.platforms = map.createLayer('Platforms', tileset3);
        this.platforms.setCollisionByExclusion(-1, true);

        map.getObjectLayer('Player').objects.forEach((Player) => {
            
            this.player = this.physics.add.sprite(Player.x, Player.y, 'Homer').setScale(0.8,0.65);
            this.player.setBounce(0);
            this.player.setCollideWorldBounds(true);
            this.player.setGravityY(1400)
            this.player.setDataEnabled();
            this.player.setData({
                iFrames: tempplayer.getData('iFrames'),
                maxFrames: tempplayer.getData('maxFrames'),
                health: tempplayer.getData('health'),
                maxhealth: tempplayer.getData('maxhealth'),
                donutCooldown: tempplayer.getData('donutCooldown'),
                donutTimer: tempplayer.getData('donutTimer'),
                donutScale: tempplayer.getData('donutScale'),
                donutAim: tempplayer.getData('donutAim'),
                donutGrav: tempplayer.getData('donutGrav'),
                donutBounce: tempplayer.getData('donutBounce'),
                damage: tempplayer.getData('damage'),
                time: tempplayer.getData('time'),
                donutSpeed: tempplayer.getData('donutSpeed'),
                speed: tempplayer.getData('speed'),
                jumpHeight: tempplayer.getData('jumpHeight'),
                jumps: tempplayer.getData('jumps'),
                jumpsMax: tempplayer.getData('jumpsMax'),
                donutSplits: tempplayer.getData('donutSplits'),
                shots: tempplayer.getData('shots')
            });
            
            
           this.player.body.x=Player.x;
           this.player.body.y=Player.y;
           this.player.x=Player.x;
           this.player.y=Player.y;
           //this.player.setDepth(100);

            this.add.text(Player.x, Player.y-40, 'Press "Z" to shoot', { font: '"Press Start 2P"' });
            this.add.text(Player.x, Player.y-30, 'Press Space to jump and double jump', { font: '"Press Start 2P"' });
            this.add.text(Player.x, Player.y-20, 'Use the arrow keys to move and aim', { font: '"Press Start 2P"' });
            //donutCooldown is the amount of time it takes to reaload
            //donutTimer is the thing that is counting down
        });
        map.getObjectLayer('StartButton').objects.forEach((StartButton) => {
            this.StartButton = this.physics.add.sprite(StartButton.x - 12, StartButton.y - StartButton.height, 'button').setScale(1);
            this.StartButton.body.immovable = true;
        });


        this.createAnims();
        this.createCameras();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyObj = this.input.keyboard.addKey('Z', true, false);

        this.createGroups();

        map.getObjectLayer('Door').objects.forEach((Door) => {
            this.Door = this.physics.add.sprite(Door.x, Door.y - Door.height - 32, 'Door').setScale(0.5, 1);
            this.Door.body.immovable = true;
        });
        map.getObjectLayer('StartZone').objects.forEach((StartZone) => {
            this.StartZone = this.physics.add.sprite(StartZone.x, StartZone.y + StartZone.height / 2, 'empty').setSize(1, StartZone.height);
            this.StartZone.body.immovable = true;
        });
        map.getObjectLayer('BossZone').objects.forEach((BossZone) => {
            this.BossZone = this.physics.add.sprite(BossZone.x, BossZone.y + BossZone.height / 2, 'empty').setSize(1, BossZone.height);
            this.BossZone.body.immovable = true;
        });
        map.getObjectLayer('NewLevel').objects.forEach((Zone) => {
            this.NewLevel = this.physics.add.sprite(Zone.x+Zone.width / 2, Zone.y + Zone.height / 2, 'empty').setSize(Zone.width, Zone.height);
            this.NewLevel.body.immovable = true;
        });

        this.buttonPressed = false

        this.graphics = this.add.graphics({
            lineStyle: { width: 1, color: 0xff0000 },
            fillStyle: { color: Phaser.Display.Color.GetColor(255, 0, 0), alpha: 0.2 }
        });

        this.lifesText = this.add.text(16, 16, 'lifes: ' + this.player.getData('maxhealth')+ " / "+ this.player.getData('maxhealth'), { fontSize: '42px', fill: '#000000' });
        this.lifesText.setScrollFactor(0);

        this.add.image(1200, 10, 'donut').setOrigin(2,0).setScale(2).setAlpha(0.5).setScrollFactor(0);   

        this.reload = this.add.image(1200, 10, 'donut').setOrigin(2,0).setScale(2);
        this.reload.setScrollFactor(0);

        this.createHitboxes();
        var dis = this;
        maped = map;
        tilesete = tileset;

        this.input.keyboard.on('keydown-SPACE', function (event) {
            if (dis.player.getData('jumps') != 0 && !dis.player.body.onFloor()) {
                dis.player.setVelocityY(dis.player.getData('jumpHeight'));
                dis.player.setData('jumps', dis.player.getData('jumps') - 1)
            }
        });
        this.Fade = this.add.image(0, 0, 'black').setOrigin(0, 0).setScale(2);
        this.Fade.setScrollFactor(0);
        this.tweens.add({
            targets: this.Fade,
            alpha: 0,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
    }

    update() {
        this.moveMountains()
        this.Iframes();
        this.ButtonState();
        this.AutoDelete();

        this.PlayerLeftRight();
        this.PlayerJump();
        this.PlayerShoot();
        this.Reload();
        //this.cameras.main.shake(20, 0.0012);
    


        var right = this.right
        var x = this.player.body.x;
        var y = this.player.body.y;
        var width = this.player.body.width;
        var height = this.player.body.height;

        var bombs = this.bombs;
        var dis = this;

        this.brawlers.children.iterate(function (child) {
            if (child.getData('type')==1) {
            if ((child.body.x > x && right) || (child.body.x < x && !right)) {
                child.body.velocity.x *= 0.97;
                child.body.velocity.y *= 0.97;
                child.alpha = 0.25;
            } else {
                let angle = Math.atan2((y - child.body.y), (x - child.body.x))
                child.body.setVelocityX(Math.cos(angle) * 200)
                child.body.setVelocityY(Math.sin(angle) * 200)
                child.alpha = 1;
            }
        } else {
            let angle = Math.atan2((y - child.body.y), (x - child.body.x))
            if ((child.body.x > x && right) || (child.body.x < x && !right)) {
                child.body.setVelocityX(Math.cos(angle) * 100)
                child.body.setVelocityY(Math.sin(angle) * 100)
                child.alpha = 0.25;
            } else {
                child.body.setVelocityX(Math.cos(angle) * 200)
                child.body.setVelocityY(Math.sin(angle) * 200)
                child.alpha = 1;
            }
        }
        })
        this.bosses.children.iterate(function (child) {
            if (child.getData('attackCooldown') <= 0) {
                var rand = Phaser.Math.FloatBetween(0, 1)
                if (child.data.values.health <= 300) {
                    child.data.values.attackCooldown = 10;
                    child.setTint(0x00ff00)
                    if (child.data.values.health>10) {
                    child.data.values.health-=7;
                    dis.HealthBar.width = 300 * (child.data.values.health / 2000)
                }
                } else if (child.data.values.health <= 1000){
                    child.data.values.attackCooldown = 100;
                    child.setTint(0xff0000)
                } else {
                    child.data.values.attackCooldown = 150;
                }
                if (rand <= 0.25) {
                    dis.graphics.fillRect(child.body.x - 700, child.body.y + child.body.height / 2, 700, child.body.height / 2);
                    dis.time.addEvent({
                        delay: 1200,
                        callback: () => {
                            dis.attack1(child)
                        }
                    });

                } else if (rand <= 0.5) {
                    dis.graphics.fillRect(child.body.x - 700, child.body.y, 700, child.body.height / 2);
                    dis.time.addEvent({
                        delay: 1200,
                        callback: () => {
                            dis.attack2(child)
                        }
                    });
                } else if (rand <= 0.75) {
                    dis.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            dis.attack3(child)
                        }
                    });
                } else {
                    for (let i = 1; i < 9; i++) {
                        dis.graphics.fillRect(child.body.x - i * 80 - 20, child.body.y, 40, child.body.height);

                    }
                    dis.time.addEvent({
                        delay: 2000,
                        callback: () => {
                            dis.attack4(child)
                        }
                    });
                    child.data.values.attackCooldown *= 2;
                }


            } else {
                child.data.values.attackCooldown -= 1;
            }
        })

    }


 
    AutoDelete() {
        if (this.bombs.countActive(true) != 0) {
            this.bombs.children.iterate(function (child) {
                if (child != null) {
                    if (child.getData('time') == 0) {
                        child.destroy();
                    } else {
                        child.data.values.time -= 1;
                        child.angle += 1;
                    }
                }
            });
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
            });
        }

        if (this.pickups.countActive(true) != 0) {
            this.pickups.children.iterate(function (child) {
                if (child != null) {
                    if (child.getData('time') == 0) {
                        child.destroy();
                    } else {
                        child.setData('time', child.getData('time') - 1);
                        child.alpha = child.getData('time') / 200;
                    }
                }
            });
        }
    }
    ButtonState() {
        if (this.buttonPressed) {
            this.StartButton.anims.play('Pressed', true);
        } else {
            this.StartButton.anims.play('unPressed', true);
        }
    }
    Reload() {
        this.reload.setCrop(0, 32*((this.player.getData('donutTimer')/this.player.getData('donutCooldown'))), 32, 32)
    }

    PlayerShoot() {
        if (this.keyObj.isDown) {
            if (this.player.getData('donutTimer') <= 0) {
                let angle;
                if (this.right) {
                    angle=Math.PI*2 
                if (this.cursors.up.isDown) {
                    angle-=Math.PI/5
                } else if (this.cursors.down.isDown) {
                    angle+=Math.PI/5
                }
                } else {
                    angle=Math.PI
                    if (this.cursors.up.isDown) {
                        angle+=Math.PI/5
                    } else if (this.cursors.down.isDown) {
                        angle-=Math.PI/5
                    }
                }
                for (let s = 0; s<=this.player.getData('shots')-1; s++) {
                    let tempangle = angle+Phaser.Math.FloatBetween(-1*Math.PI/this.player.getData('donutAim'),Math.PI/this.player.getData('donutAim'))
                this.donut = this.donuts.create(this.player.body.x + this.player.body.width / 2, this.player.body.y + this.player.body.height / 2, 'donut');
                this.donut.setScale(this.player.getData('donutScale'));
                this.donut.setVelocityX(Math.cos(tempangle) * this.player.getData('donutSpeed'))
                this.donut.setVelocityY(Math.sin(tempangle) * this.player.getData('donutSpeed'))
                this.donut.setBounce(this.player.getData('donutBounce'));
                this.donut.setGravityY(this.player.getData('donutGrav'));
                this.donut.setDataEnabled();
                this.donut.setData({ time: this.player.getData('time'), damage: this.player.getData('damage'), splits: this.player.getData('donutSplits') });
                }
                this.player.setData('donutTimer', this.player.getData('donutCooldown'));
            }
        }
        if (this.player.getData('donutTimer') != 0) {
            this.player.setData('donutTimer', this.player.getData('donutTimer') - 1);
        }
    }
    PlayerJump() {
        if (this.cursors.space.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(this.player.getData('jumpHeight'));
        }
        if (this.player.body.onFloor()) {
            this.player.setData('jumps', this.player.getData('jumpsMax'));
        }
    }
    PlayerLeftRight() {
        if (this.cursors.left.isDown && this.cursors.right.isDown) {
            this.player.body.velocity.x *= 0.9;
            this.player.anims.play('stand', true);
        } else if (this.cursors.left.isDown) {
            this.right = false;
            if (this.player.body.velocity.x >= this.player.getData('speed') * -1) {
                this.player.setVelocityX(this.player.body.velocity.x + this.player.getData('speed') * -0.2);
            }
            this.player.anims.play('walk', true);
        } else if (this.cursors.right.isDown) {
            this.right = true;
            if (this.player.body.velocity.x <= this.player.getData('speed')) {
                this.player.setVelocityX(this.player.body.velocity.x + this.player.getData('speed') * 0.2);
            }
            this.player.anims.play('walk', true);
        } else {
            this.player.body.velocity.x *= 0.9;
            this.player.anims.play('stand', true);
        }
        if (this.right) {
            this.player.setFlipX(false)
        } else {
            this.player.setFlipX(true)
        }
    }
    Iframes() {
        this.player.tint = Phaser.Display.Color.GetColor(255 - 100 * (this.player.data.values.iFrames / this.player.getData('maxFrames')), 255 - 100 * (this.player.data.values.iFrames / this.player.getData('maxFrames')), 255 - 155 * (this.player.data.values.iFrames / this.player.getData('maxFrames')));
        if (this.player.getData('iFrames') != 0) {
            this.player.setData('iFrames', this.player.getData('iFrames') - 1);
        }
    }

    createCameras() {
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setLerp(0.1, 0.1);
        this.cameras.main.setSize(1150, 600);
        this.cameras.main.setBounds(0, 0, 4768, 608);
    }
    createAnims() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('Homer', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'stand',
            frames: [{ key: 'Homer', frame: 0 }],
            frameRate: 20
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

        this.anims.create({
            key: '0',
            frames: [{ key: 'Powerups', frame: 0 }],
            frameRate: 20
        });
        this.anims.create({
            key: '1',
            frames: [{ key: 'Powerups', frame: 1 }],
            frameRate: 20
        });
        this.anims.create({
            key: '2',
            frames: [{ key: 'Powerups', frame: 2 }],
            frameRate: 20
        });
        this.anims.create({
            key: '3',
            frames: [{ key: 'Powerups', frame: 3 }],
            frameRate: 20
        });
        this.anims.create({
            key: '4',
            frames: [{ key: 'Powerups', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: '5',
            frames: [{ key: 'Powerups', frame: 5 }],
            frameRate: 20
        });
        this.anims.create({
            key: '6',
            frames: [{ key: 'Powerups', frame: 6 }],
            frameRate: 20
        });
        this.anims.create({
            key: '7',
            frames: [{ key: 'Powerups', frame: 7 }],
            frameRate: 20
        });
        this.anims.create({
            key: '8',
            frames: [{ key: 'Powerups', frame: 8 }],
            frameRate: 20
        });
        this.anims.create({
            key: '9',
            frames: [{ key: 'Powerups', frame: 9 }],
            frameRate: 20
        });
    }
    createMountains() {
        this.background11 = this.add.image(0, 508, 'Mountain1').setOrigin(0, 1);
        this.background11.setScrollFactor(0);
        this.background12 = this.add.image(832, 508, 'Mountain1').setOrigin(0, 1);
        this.background12.setScrollFactor(0);
        this.background13 = this.add.image(832*2, 508, 'Mountain1').setOrigin(0, 1);
        this.background13.setScrollFactor(0);
        
        this.background21 = this.add.image(0, 508, 'Mountain2').setOrigin(0, 1);
        this.background21.setScrollFactor(0);
        this.background22 = this.add.image(897, 508, 'Mountain2').setOrigin(0, 1);
        this.background22.setScrollFactor(0);
        this.background23 = this.add.image(897*2, 508, 'Mountain2').setOrigin(0, 1);
        this.background23.setScrollFactor(0);

        this.background31 = this.add.image(0, 508, 'Mountain3').setOrigin(0, 1);
        this.background31.setScrollFactor(0);
        this.background32 = this.add.image(867, 508, 'Mountain3').setOrigin(0, 1);
        this.background32.setScrollFactor(0);
        this.background33 = this.add.image(867*2, 508, 'Mountain3').setOrigin(0, 1);
        this.background33.setScrollFactor(0);
        
        
    }
    createGroups() {
        this.donuts = this.physics.add.group({});
        this.bombs = this.physics.add.group({});

        this.brawlers = this.physics.add.group({});

        this.pickups = this.physics.add.group({});
        this.items = this.physics.add.group({});

        this.bosses = this.physics.add.group({});
    }
    createHitboxes() {
        this.physics.add.collider(this.donuts, this.platforms, this.split, null, this);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.pickups, this.platforms);
        this.physics.add.collider(this.player, this.StartDoor);
        this.physics.add.collider(this.player, this.Door);

        this.physics.add.overlap(this.player, this.StartZone, this.start, null, this);
        this.physics.add.overlap(this.player, this.BossZone, this.Bosstime, null, this);

        this.physics.add.overlap(this.player, this.brawlers, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.items, this.itemed, null, this);
        this.physics.add.collider(this.player, this.bosses, this.hitPlayer, null, this);

        this.physics.add.collider(this.player, this.NewLevel, this.NextLevel, null, this);

        this.physics.add.collider(this.bombs, this.platforms, this.destroyBullet, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.hitPlayerBomb, null, this);
        this.physics.add.overlap(this.donuts, this.brawlers, this.hitBrawler, null, this);
        this.physics.add.overlap(this.donuts, this.bosses, this.hitBoss, null, this);
        this.physics.add.overlap(this.donuts, this.StartButton, this.hitButton, null, this);

        this.physics.add.overlap(this.player, this.pickups, this.pickuped, null, this);
    }

    moveMountains() {
        this.background11.x-=0.2
        this.background12.x-=0.2
        this.background13.x-=0.2
        if (this.background11.x<-900) {
            this.background11.x = this.background13.x+this.background13.width-40;
        }
        if (this.background12.x<-900) {
            this.background12.x = this.background11.x+this.background11.width-40;
        }
        if (this.background13.x<-900) {
            this.background13.x = this.background12.x+this.background12.width-40;
        }
        this.background21.x-=0.4
        this.background22.x-=0.4
        this.background23.x-=0.4
        if (this.background21.x<-900) {
            this.background21.x = this.background23.x+this.background23.width-40;
        }
        if (this.background22.x<-900) {
            this.background22.x = this.background21.x+this.background21.width-40;
        }
        if (this.background23.x<-900) {
            this.background23.x = this.background22.x+this.background22.width-40;
        }
        this.background31.x-=0.6
        this.background32.x-=0.6
        this.background33.x-=0.6
        if (this.background31.x<-900) {
            this.background31.x = this.background33.x+this.background33.width-40;
        }
        if (this.background32.x<-900) {
            this.background32.x = this.background31.x+this.background31.width-40;
        }
        if (this.background33.x<-900) {
            this.background33.x = this.background32.x+this.background32.width-40;
        }
    }

    

    hitButton(donut, _button) {
        if (!this.buttonPressed) {
            donut.setData('time', 0);
            this.buttonPressed = true;
            this.tweens.add({
                targets: this.StartDoor,
                y: 400,
                duration: 400,
            });
        }
    }
    destroyBullet(bomb, _platform) {
        if (bomb.getData('type') == 1) {
            bomb.destroy();
        } else if (bomb.getData('type') == 2) {
            bomb.body.y += 20;
            bomb.body.setVelocityY(400)
        }
    }

    hitBrawler(donut, brawler) {
        brawler.data.values.health -= donut.getData('damage');
        if (brawler.getData('health') <= 0) {
            this.spawnHealth(brawler);

            brawler.destroy();
        }
        donut.setData('time', 0);
    };
    hitBoss(donut, boss) {
        boss.data.values.health -= donut.getData('damage');
        console.log(boss.data.values.Health)
        this.HealthBar.width = 300 * (boss.data.values.health / 2000)
        if (boss.getData('health') <= 0) {
            this.spawnHealth(boss);

            boss.destroy();
        }
        donut.setData('time', 0);
    };

    hitPlayerBomb(player, bomb) {
        bomb.data.values.time = 0;
        this.hitPlayer(player);

    };
    hitPlayerBrawler(player, _brawler) {
        this.hitPlayer(player);
    };
    hitPlayer(player, _not) {
        if (player.getData('iFrames') == 0) {
            player.data.values.health -= 1;
            //this.doh.play();
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);
            if (player.data.values.health <= 0) {
                player.setTint(0xff0000);
                this.physics.pause();

                player.anims.play('turn');

                this.gameOver = true;
            }
            player.data.values.iFrames = player.getData('maxFrames');
        }
    };

    pickuped(player, pickup) {
        if (player.getData('health') != player.getData('maxhealth')) {
            player.setData('health', player.getData('health') + pickup.getData('health'));
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);
            pickup.destroy();
        }
    }
    itemed(player, item) {
        if (item.getData('type') == 1) {
            this.player.setData('damage', this.player.getData('damage') * 1.5)
        } else if (item.getData('type') == 2) {
            this.player.setData('jumpHeight', this.player.getData('jumpHeight') * 1.25)

        } else if (item.getData('type') == 3) {
            this.player.setData('time', this.player.getData('time') * 3)

        } else if (item.getData('type') == 4) {
            this.player.setData('donutSpeed', this.player.getData('donutSpeed') + 150)

        } else if (item.getData('type') == 5) {
            this.player.setData('jumpsMax', this.player.getData('jumpsMax') + 2)

        } else if (item.getData('type') == 6) {
            this.player.setData('shots', this.player.getData('shots')+2)
            this.player.setData('donutCooldown', this.player.getData('donutCooldown') * 1.3)

        } else if (item.getData('type') == 7) {
            this.player.setData('Speed', this.player.getData('speed') + 300)

        } else if (item.getData('type') == 8) {
            this.player.setData('donutCooldown', this.player.getData('donutCooldown') * 0.7)

        } else if (item.getData('type') == 9) {
            this.player.setData('health', this.player.getData('health') + 3)
            this.player.setData('maxhealth', this.player.getData('maxhealth') + 3)
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);

        } else {
            this.player.setData('donutSplits', this.player.getData('donutSplits') + 2)
        }
        this.items.clear(true, true);
    }

    spawnHealth(location) {
        if (Phaser.Math.FloatBetween(0, 1) < 0.1) {
            var Health = this.pickups.create(location.x, location.y, 'health').setScale(0.5);
            Health.setDataEnabled();
            Health.setData({ health: 1, time: 150 });
            Health.setGravityY(300)
            if (Phaser.Math.FloatBetween(0, 1) >= 0.5) {
                Health.setVelocityX(75);
            } else {
                Health.setVelocityX(-75);
            }
            Health.body.setBounce(1, 0.2)
        }
    }
    start(_player, StartZone) {
        this.tweens.add({
            targets: this.StartDoor,
            y: 480-16,
            duration: 1200,
            ease: 'Bounce'
        });
        this.tweens.add({
            targets: this.Door,
            y: 416-64,
            duration: 150,
            ease: 'Sine.easeInOut',
        });

        StartZone.destroy();
        this.Started = true;
    }
    Bosstime(_player, _Bosszone) {
        this.cameras.main.setBounds(1500, 0, 2600, 608)
        this.tweens.add({
            targets: this.Door,
            y: 448-16,
            duration: 150,
            ease: 'Sine.easeInOut',
        });
        this.BossZone.destroy();
        maped.getObjectLayer('Boss').objects.forEach((Boss) => {

            this.boss = this.bosses.create(Boss.x, Boss.y, 'boss').setScale(4);
            this.boss.setDataEnabled();
            this.boss.setData({ health: 2000, attackCooldown: 150 });
            this.boss.body.immovable = true;

            this.HealthBarBack = this.add.rectangle(Boss.x - 400, Boss.y - this.boss.body.height * 2, 308, 68, 0x000000);
            this.HealthBar = this.add.rectangle(Boss.x - 400, Boss.y - this.boss.body.height * 2, 300, 60, 0xff0000);
        });
    }

    attack1(child) {
        if (child.data != undefined) {
            for (var i = 0; i < 10; i++) {
                var bomb = this.bombs.create(child.body.x, child.body.y + child.body.height / 2 + i * child.body.height / 20, this.RandPaket());
                bomb.setDataEnabled();
                bomb.setData({ time: 40, type: 1 });
                bomb.setVelocityX(-1000)
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
            }
        }
        this.graphics.clear();
    }
    attack2(child) {
        if (child.data != undefined) {
            for (var i = 0; i < 10; i++) {
                var bomb = this.bombs.create(child.body.x, child.body.y + i * child.body.height / 20, this.RandPaket());
                bomb.setDataEnabled();
                bomb.setData({ time: 40, type: 1 });
                bomb.setVelocityX(-1000)
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
            }
        }
        this.graphics.clear();
    }
    attack3(_child) {
        this.brawler = this.brawlers.create(this.player.body.x + 200, this.player.body.y - 200, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 , type: 2});
        this.brawler.setTint(0xff0000)
        this.brawler = this.brawlers.create(this.player.body.x - 200, this.player.body.y - 200, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 , type: 2});
        this.brawler.setTint(0xff0000)
        this.brawler = this.brawlers.create(this.player.body.x + 100, this.player.body.y - 300, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 , type: 2});
        this.brawler.setTint(0xff0000)
        this.brawler = this.brawlers.create(this.player.body.x - 100, this.player.body.y - 300, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 , type: 2});
        this.brawler.setTint(0xff0000)

    }
    attack4(child) {
        this.graphics.clear();
        if (child.data != undefined) {
            for (let i = 1; i < 9; i++) {
                var bomb = this.bombs.create(child.body.x - i * 80, child.body.y, 'snoboll').setScale(0.5);
                bomb.setDataEnabled();
                bomb.setData({ time: 60, type: 2 });
                bomb.setVelocityY(400);
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
                this.graphics.fillRect(child.body.x - i * 80 + 20, child.body.y, 40, child.body.height);
            }
            this.graphics.fillRect(child.body.x - 9 * 80 + 20, child.body.y, 40, child.body.height);
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.attack41(child)
                }
            });
        }
    }
    attack41(child) {
        this.graphics.clear();
        if (child.data != undefined) {
            for (let i = 1; i < 10; i++) {
                var bomb = this.bombs.create(child.body.x - i * 80 + 40, child.body.y, 'snoboll').setScale(0.6);
                bomb.setDataEnabled();
                bomb.setData({ time: 60, type: 2 });
                bomb.setVelocityY(400);
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
            }
        }
    }

    split(donut, _not) {
        if (donut.getData('splits') >= 2) {
            this.donut = this.donuts.create(donut.body.x + donut.body.width / 2, donut.body.y + donut.body.height / 2, 'donut');
            this.donut.setScale(0.5);
            this.donut.body.velocity.x = Phaser.Math.FloatBetween(-1 * this.player.getData('donutSpeed'), this.player.getData('donutSpeed'))
            this.donut.body.velocity.y = Phaser.Math.FloatBetween(-1 * this.player.getData('donutSpeed'), this.player.getData('donutSpeed'))
            this.donut.setBounce(0.8);
            this.donut.setGravityY(300);
            this.donut.setDataEnabled();
            this.donut.setData({ time: donut.getData('time'), damage: donut.getData('damage'), splits: donut.getData('splits') - 1 });
            donut.setData('splits', donut.getData('splits') - 1)
        }
    }
    RandPaket() {
        var rand = Phaser.Math.FloatBetween(0, 3)
        if (rand <= 1) {
            return 'paket1'
        } else if (rand <= 2) {
            return 'paket2'
        } else {
            return 'paket3'
        }
    }

    NextLevel(_player, _zone) {
        //this.scene.pause();
        this.tweens.add({
            targets: this.Fade,
            alpha: 1,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
        this.win = this.add.text(0, this.game.config.height/2-60, 'WINNER\ :) ', { font: '"Press Start 2P"', fontSize: '1272px', color: '#ff0', align: 'center', fixedWidth: this.game.config.width, fixedHeight: this.game.config.height});
        this.win.setScrollFactor(0);
        this.HealthBar.destroy();
    }
}

export default PlayScene4;

var maped;
class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.gameOver = false;
        this.right = true;
        this.physics.world.setBounds(0, 0, 4768, 608)

        this.doh = this.sound.add('doh');

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.5);
        this.background.setScrollFactor(0)

        const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage('32Tileset', 'tiles');
        this.Started = false;

        this.tilebackground = map.createLayer('Background', tileset);

        map.getObjectLayer('StartDoor').objects.forEach((StartDoor) => {
            this.StartDoor = this.physics.add.sprite(StartDoor.x, StartDoor.y - StartDoor.height, 'Door').setScale(0.5, 0.5);
            this.StartDoor.body.immovable = true;
        });
        
        this.platforms = map.createLayer('Platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);

        map.getObjectLayer('Player').objects.forEach((Player) => {
            this.player = this.physics.add.sprite(Player.x, Player.y, 'dude');
            this.player.setBounce(0);
            this.player.setCollideWorldBounds(true);
            this.player.setGravityY(1400)
            this.player.setDataEnabled();
            this.player.setData({
                iFrames: 80,
                maxFrames: 80,
                health: 6,
                maxhealth: 6,
                donutCooldown: 40,
                donutTimer: 40,
                damage: 10,
                time: 140,
                donutSplits: 11,
                donutSpeed: 450,
                speed: 400,
                jumpHeight: -500,
                jumps: 1,
                jumpsMax: 1
            });
            //donutCooldown is the amount of time it takes to reaload
            //donutTimer is the thing that is counting down
        });

        this.createAnims();
        

        this.createCameras();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyObj = this.input.keyboard.addKey('Z', true, false);

        this.donuts = this.physics.add.group({
        });
        this.bombs = this.physics.add.group({
        })

        this.Shooters = this.physics.add.group({
        })
        this.brawlers = this.physics.add.group({
        })

        this.pickups = this.physics.add.group({
        })
        this.items = this.physics.add.group({
        })

        this.bosses = this.physics.add.group({
        })

        map.getObjectLayer('Door').objects.forEach((Door) => {
            this.Door = this.physics.add.sprite(Door.x, Door.y - Door.height - 32, 'Door').setScale(0.5, 1);
            this.Door.body.immovable = true;
        });
        map.getObjectLayer('StartButton').objects.forEach((StartButton) => {
            this.StartButton = this.physics.add.sprite(StartButton.x - 12, StartButton.y - StartButton.height, 'button').setScale(1);
            this.StartButton.body.immovable = true;
        });
        map.getObjectLayer('StartZone').objects.forEach((StartZone) => {
            this.StartZone = this.physics.add.sprite(StartZone.x, StartZone.y + StartZone.height / 2, 'empty').setSize(1, StartZone.height);
            this.StartZone.body.immovable = true;
        });
        map.getObjectLayer('Items').objects.forEach((Item) => {
            let random = Phaser.Math.FloatBetween(0, 10)
            this.Item = this.items.create(Item.x, Item.y, 'Powerups').setScale(1);
            this.add.text(Item.x, Item.y, 'Hello World', { font: '"Press Start 2P"' });
            if (random<=1) {
                this.Item.anims.play('0', true);
                this.Item.setData({ type: 1});
            } else if (random<=2){
                this.Item.anims.play('1', true);
                this.Item.setData({ type: 2});
            } else if (random<=3){
                this.Item.anims.play('2', true);
                this.Item.setData({ type: 3});
            } else if (random<=4){
                this.Item.anims.play('3', true);
                this.Item.setData({ type: 4});
            } else if (random<=5){
                this.Item.anims.play('4', true);
                this.Item.setData({ type: 5});
            } else if (random<=6){
                this.Item.anims.play('5', true);
                this.Item.setData({ type: 6});
            } else if (random<=7){
                this.Item.anims.play('6', true);
                this.Item.setData({ type: 7});
            } else if (random<=8){
                this.Item.anims.play('7', true);
                this.Item.setData({ type: 8});
            } else if (random<=9){
                this.Item.anims.play('8', true);
                this.Item.setData({ type: 9});
            } else {
                this.Item.anims.play('9', true);
                this.Item.setData({ type: 10});
            }
        });
        map.getObjectLayer('Boss').objects.forEach((Boss) => {
        
        this.boss = this.bosses.create(Boss.x, Boss.y, 'boss').setScale(4);
        this.boss.setDataEnabled();
        this.boss.setData({ health: 2000, attackCooldown: 150 });
        this.boss.body.immovable = true;

        this.HealthBarBack = this.add.rectangle(Boss.x-400, Boss.y-this.boss.body.height*2, 308, 68, 0x000000);
        this.HealthBar = this.add.rectangle(Boss.x-400, Boss.y-this.boss.body.height*2, 300, 60, 0xff0000);
        });
        
        this.buttonPressed = false        

        this.graphics = this.add.graphics({
            lineStyle: { width: 1, color: 0xff0000 },
            fillStyle: { color: Phaser.Display.Color.GetColor(255,0,0), alpha: 0.2}
        });

        this.lifesText = this.add.text(16, 16, 'lifes: 6 / 6', { fontSize: '42px', fill: '#000000' });
        this.lifesText.setScrollFactor(0);

        this.Hitboxes();
        var dis = this;
        maped = map;

        this.input.keyboard.on('keydown-SPACE', function (event) {
            if (dis.player.getData('jumps') != 0 && !dis.player.body.onFloor()) {
                dis.player.setVelocityY(dis.player.getData('jumpHeight'));
                dis.player.setData('jumps', dis.player.getData('jumps') - 1)
            }
        });
        
        
    }

    Hitboxes() {
        this.physics.add.collider(this.Shooters, this.platforms);
        this.physics.add.collider(this.donuts, this.platforms, this.split, null, this);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.pickups, this.platforms);
        this.physics.add.collider(this.player, this.StartDoor);
        this.physics.add.collider(this.player, this.Door);

        this.physics.add.overlap(this.player, this.StartZone, this.start, null, this);

        this.physics.add.overlap(this.player, this.Shooters, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.brawlers, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.items, this.itemed, null, this);
        this.physics.add.collider(this.player, this.boss, this.hitPlayer, null, this);

        this.physics.add.collider(this.bombs, this.platforms, this.destroyBullet, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.hitPlayerBomb, null, this);
        this.physics.add.overlap(this.donuts, this.Shooters, this.hitShooter, null, this);
        this.physics.add.overlap(this.donuts, this.brawlers, this.hitBrawler, null, this);
        this.physics.add.overlap(this.donuts, this.bosses, this.hitBoss, null, this);
        this.physics.add.overlap(this.donuts, this.StartButton, this.hitButton, null, this);

        this.physics.add.overlap(this.player, this.pickups, this.pickuped, null, this);
    }

    update() {
        this.Iframes();
        this.ButtonState();
        this.AutoDelete();

        this.PlayerLeftRight();
        this.PlayerJump();
        this.PlayerShoot();


        if (this.cursors.down.isDown) {

        }


        var right = this.right
        var x = this.player.body.x;
        var y = this.player.body.y;
        var width = this.player.body.width;
        var height = this.player.body.height;

        var bombs = this.bombs;
        var dis = this;

        this.brawlers.children.iterate(function (child) {
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
        })
        this.Shooters.children.iterate(function (child) {
            var num = dis.Raycast(x, y, width, height, child);
            if (child.getData('time') >= 100 && num == 0) {
                if (child.getData('type') == 1) {
                    let angle = Math.atan2((y - child.body.y), (x - child.body.x))
                    var bomb = bombs.create(child.body.x + 32, child.body.y + 32, 'snoboll').setScale(0.5);
                    let speed = 500;
                    bomb.setDataEnabled();
                    bomb.setData({ time: 100, type: 1 });
                    bomb.setVelocityX(Math.cos(angle) * speed)
                    bomb.setVelocityY(Math.sin(angle) * speed)
                    bomb.setCollideWorldBounds(true);
                    bomb.body.setGravityY(0);
                } else {
                    for (let i = 0; i < 3; i++) {
                        let angle = Math.atan2((y - child.body.y), (x - child.body.x)) + ((i * 0.1) - 0.1)
                        var bomb = bombs.create(child.body.x + 32, child.body.y + 32, 'snoboll').setScale(0.5);
                        let speed = 500;
                        bomb.setDataEnabled();
                        bomb.setData({ time: 100, type: 1 });
                        bomb.setVelocityX(Math.cos(angle) * speed)
                        bomb.setVelocityY(Math.sin(angle) * speed)
                        bomb.setCollideWorldBounds(true);
                        bomb.body.setGravityY(0);
                    }
                }
                child.data.values.time = 0;
            } else {
                child.data.values.time += 1;
            }
        })
        this.bosses.children.iterate(function (child) {
            if (child.getData('attackCooldown') <= 0) {
                var rand = Phaser.Math.FloatBetween(0, 1)
                if (child.data.values.health<=1000) {
                    child.data.values.attackCooldown = 100;
                    child.setTint(0xff0000)
                } else {
                    child.data.values.attackCooldown = 150;
                }
                if (rand <= 0.25) {
                    //dis.rect = dis.add.rectangle(child.body.x - 700, child.body.y + child.body.height / 2, 700, child.body.height / 2, Phaser.Display.Color.GetColor(255,0,0)).setOrigin(0,0).setAlpha(0.2);
                    dis.graphics.fillRect(child.body.x - 600, child.body.y + child.body.height / 2, 600, child.body.height / 2);
                    dis.time.addEvent({
                        delay: 1000,
                        callback: ()=>{
                            dis.attack1(child)
                        }
                    });
                    
                } else if (rand <= 0.5) {
                    dis.graphics.fillRect(child.body.x - 600, child.body.y, 600, child.body.height / 2);
                    dis.time.addEvent({
                        delay: 1000,
                        callback: ()=>{
                            dis.attack2(child)
                        }
                    });
                } else if (rand <= 0.75) {
                    dis.time.addEvent({
                        delay: 1000,
                        callback: ()=>{
                            dis.attack3(child)
                        }
                    });
                } else {
                    for (let i = 1; i <8; i++) {
                        dis.graphics.fillRect(child.body.x-i*80-20, child.body.y, 40, child.body.height);
                    
                    }
                    dis.time.addEvent({
                        delay: 2000,
                        callback: ()=>{
                            dis.attack4(child)
                        }
                    });
                    child.data.values.attackCooldown *=2;
                }


            } else {
                child.data.values.attackCooldown -= 1;
            }
        })


        if (this.Shooters.countActive(true) == 0 && this.brawlers.countActive(true) == 0 && this.Started) {
            this.Door.destroy();

            console.log("BRAM")
        }
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
                        child.alpha = child.getData('time') / 300;
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

    PlayerShoot() {
        if (this.keyObj.isDown) {
            if (this.player.getData('donutTimer') <= 0) {
                this.donut = this.donuts.create(this.player.body.x + this.player.body.width / 2, this.player.body.y + this.player.body.height / 2, 'donut');
                this.donut.setScale(0.5);
                if (this.right) {
                    this.donut.body.velocity.x = this.player.getData('donutSpeed');
                    this.donut.angle = 270;
                } else {
                    this.donut.body.velocity.x = -1* this.player.getData('donutSpeed');
                    this.donut.angle = 90;
                }
                if (this.cursors.up.isDown) {
                    this.donut.body.velocity.y = -1*this.player.getData('donutSpeed')/2;
                } else if (this.cursors.down.isDown) {
                    this.donut.body.velocity.y = this.player.getData('donutSpeed')/2;
                }
                this.donut.setBounce(0.8);
                this.donut.setGravityY(300);
                this.donut.setDataEnabled();
                this.donut.setData({ time: this.player.getData('time'), damage: this.player.getData('damage'), splits: this.player.getData('donutSplits') });
                this.player.setData('donutTimer', this.player.getData('donutCooldown'));
                console.log("damage =" + this.donut.getData('damage'));
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
            this.player.anims.play('turn', true);
        } else if (this.cursors.left.isDown) {
            this.right = false;
            if (this.player.body.velocity.x >= this.player.getData('speed') * -1) {
                this.player.setVelocityX(this.player.body.velocity.x + this.player.getData('speed') * -0.2);
            }
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.right = true;
            if (this.player.body.velocity.x <= this.player.getData('speed')) {
                this.player.setVelocityX(this.player.body.velocity.x + this.player.getData('speed') * 0.2);
            }
            this.player.anims.play('right', true);
        } else {
            this.player.body.velocity.x *= 0.9;
            this.player.anims.play('turn', true);
        }
    }

    Iframes() {
        this.player.tint = Phaser.Display.Color.GetColor(255 - 100 * (this.player.data.values.iFrames / this.player.getData('maxFrames')),255 - 100 * (this.player.data.values.iFrames / this.player.getData('maxFrames')), 255 - 155 * (this.player.data.values.iFrames / this.player.getData('maxFrames')));
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

    hitButton(donut, _button) {
        if (!this.buttonPressed) {
        donut.setData('time', 0);
        this.buttonPressed = true;
        this.tweens.add({
            targets: this.StartDoor,
            y: 416,
            duration: 200,
            //ease: 'Sine.easeInOut',
            //repeat: -1,
            //yoyo: true
        });
    }
    }
    destroyBullet(bomb, _platform) {
        if (bomb.getData('type')==1){
            bomb.destroy();
        } else if (bomb.getData('type')==2) {
            bomb.body.y+=20;
            bomb.body.setVelocityY(400)
        }
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
    hitBoss(donut, boss) {
        boss.data.values.health -= donut.getData('damage');
        console.log(boss.data.values.Health)
        this.HealthBar.width = 300*(boss.data.values.health/2000)
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
    hitPlayerShooter(player, _shooter) {
        this.hitPlayer(player);
    };
    hitPlayerBrawler(player, _brawler) {
        this.hitPlayer(player);
    };
    hitPlayer(player, _not) {
        if (player.getData('iFrames') == 0) {
            player.data.values.health -= 1;
            this.doh.play();
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
        console.log(item.getData('type'))
        if (item.getData('type')==1) {
            this.player.setData('damage', this.player.getData('damage')*2)
            console.log(this.player.getData('damage'))
        } else if (item.getData('type')==2) {
            this.player.setData('jumpHeight', this.player.getData('jumpHeight')*1.25)
            console.log(this.player.getData('jumpHeight'))
        } else if (item.getData('type')==3) {
            this.player.setData('time', this.player.getData('time')*3)
            console.log(this.player.getData('time'))
        } else if (item.getData('type')==4) {
            this.player.setData('donutSpeed', this.player.getData('donutSpeed')+150)
            console.log(this.player.getData('donutSpeed'))
        } else if (item.getData('type')==5) {
            this.player.setData('jumpsMax', this.player.getData('jumpsMax')+1)
            console.log(this.player.getData('jumpsMax'))
        } else if (item.getData('type')==6) {

        } else if (item.getData('type')==7) {
            this.player.setData('Speed', this.player.getData('speed')+200)
            console.log(this.player.getData('speed'))
        } else if (item.getData('type')==8) {
            this.player.setData('donutCooldown', this.player.getData('donutCooldown')*0.5)
            console.log(this.player.getData('donutCooldown'))
        } else if (item.getData('type')==9) {
            this.player.setData('health', this.player.getData('health')+2)
            this.player.setData('maxhealth', this.player.getData('maxhealth')+2)
            console.log(this.player.getData('health'))
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);
        } else {
            this.player.setData('donutSplits', this.player.getData('donutSplits')+1)
            console.log(this.player.getData('donutSplits'))
        }
        this.items.clear(true,true);
    }

    spawnHealth(location) {
        if (Phaser.Math.FloatBetween(0, 1) > 0.1) {
            var Health = this.pickups.create(location.x, location.y, 'health').setScale(0.5);
            Health.setDataEnabled();
            Health.setData({ health: 1, time: 300 });
            Health.setGravityY(300)
            if (Phaser.Math.FloatBetween(0, 1) >= 0.5) {
                Health.setVelocityX(75);
            } else {
                Health.setVelocityX(-75);
            }
            Health.body.setBounce(1, 0.2)
        }
    }
    Raycast(x, y, width, height, child) {
        let line = new Phaser.Geom.Line(x, y, child.x, child.y - 16);
        let line2 = new Phaser.Geom.Line(x + width, y + height, child.x, child.y + 16);
        let line3 = new Phaser.Geom.Line(x, y + height, child.x, child.y - 16);
        let line4 = new Phaser.Geom.Line(x + width, y, child.x, child.y + 16);
        //this.graphics.strokeLineShape(line);
        //this.graphics.strokeLineShape(line2);
        //this.graphics.strokeLineShape(line3);
        //this.graphics.strokeLineShape(line4);
        let overlappingTiles = this.platforms.getTilesWithinShape(line, { isColliding: true });
        let overlappingTiles2 = this.platforms.getTilesWithinShape(line2, { isColliding: true });
        let overlappingTiles3 = this.platforms.getTilesWithinShape(line3, { isColliding: true });
        let overlappingTiles4 = this.platforms.getTilesWithinShape(line4, { isColliding: true });
        return overlappingTiles.length + overlappingTiles2.length + overlappingTiles3.length + overlappingTiles4.length;
    }
    start(_player, StartZone) {
        this.tweens.add({
            targets: this.StartDoor,
            y: 480,
            duration: 150,
            ease: 'Sine.easeInOut',
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
            console.log(shooter.type)
            if (shooter.type == 0) {
                this.shooter.setData({ time: Phaser.Math.FloatBetween(0, 100), type: 1, health: 10 });
            } else {
                this.shooter.setData({ time: Phaser.Math.FloatBetween(0, 100), type: 2, health: 30 });
                this.shooter.setTint(0x0000ff)
            }
        });

        StartZone.destroy();
        this.Started = true;
    }

    attack1(child) {
        if (child.data!=undefined) {
            for (var i = 0; i < 10; i++) {
                var bomb = this.bombs.create(child.body.x, child.body.y + child.body.height / 2 + i * child.body.height / 20, 'snoboll');
                bomb.setDataEnabled();
                bomb.setData({ time: 35, type: 1 });
                bomb.setVelocityX(-1000)
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
            }
        }
    this.graphics.clear();
    }
    attack2(child) {
        if (child.data!=undefined) {
            for (var i = 0; i < 10; i++) {
                var bomb = this.bombs.create(child.body.x, child.body.y + i * child.body.height / 20, 'snoboll');
                bomb.setDataEnabled();
                bomb.setData({ time: 35, type: 1 });
                bomb.setVelocityX(-1000)
                bomb.setCollideWorldBounds(true);
                bomb.body.setGravityY(0);
            }
        }
        this.graphics.clear();
    }
    attack3(_child) {
        this.brawler = this.brawlers.create(this.player.body.x+200, this.player.body.y-200, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 });
        this.brawler = this.brawlers.create(this.player.body.x-200, this.player.body.y-200, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 });
        this.brawler = this.brawlers.create(this.player.body.x+100, this.player.body.y-300, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 });
        this.brawler = this.brawlers.create(this.player.body.x-100, this.player.body.y-300, 'brawler').setScale(0.5);
        this.brawler.setVelocityX(0);
        this.brawler.setVelocityY(0);
        this.brawler.setDataEnabled();
        this.brawler.setData({ health: 5 });
        
    }
    attack4(child) {
        this.graphics.clear();
        if (child.data!=undefined) {
        for (let i = 1; i < 8; i++) {
            var bomb = this.bombs.create(child.body.x - i*80, child.body.y, 'snoboll').setScale(0.5);
            bomb.setDataEnabled();
            bomb.setData({ time: 60, type: 2 });
            bomb.setVelocityY(400);
            bomb.setCollideWorldBounds(true);
            bomb.body.setGravityY(0);
            this.graphics.fillRect(child.body.x-i*80+20, child.body.y, 40, child.body.height);
        }
        this.graphics.fillRect(child.body.x-8*80+20, child.body.y, 40, child.body.height);
        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.attack41(child)
            }
        });
    }
    }
    attack41(child) {
        this.graphics.clear();
        if (child.data!=undefined) {
        for (let i = 1; i < 9; i++) {
            var bomb = this.bombs.create(child.body.x - i*80+40, child.body.y, 'snoboll').setScale(0.6);
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
                this.donut.body.velocity.x = Phaser.Math.FloatBetween(-1*this.player.getData('donutSpeed'), this.player.getData('donutSpeed'))
                this.donut.body.velocity.y = Phaser.Math.FloatBetween(-1*this.player.getData('donutSpeed'), this.player.getData('donutSpeed'))
                this.donut.setBounce(0.8);
                this.donut.setGravityY(300);
                this.donut.setDataEnabled();
                this.donut.setData({ time: donut.getData('time'), damage: donut.getData('damage'), splits: donut.getData('splits')-1 });
                donut.setData('splits', donut.getData('splits')-1)
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
}

export default PlayScene;

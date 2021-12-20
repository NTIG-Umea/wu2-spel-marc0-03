var maped;
class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
        this.scenetest = "tjena från " + this.scene;
    }

    create() {
        this.gameOver = false;
        this.right = true;
        this.physics.world.setBounds(0, 0, 4768, 608)

        this.doh = this.sound.add('doh');

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(0.32);
        this.background.setScrollFactor(0)

        this.createMountains();

        const map = this.make.tilemap({ key: "map1", tileWidth: 32, tileHeight: 32 });
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
            this.add.text(Player.x, Player.y-40, 'Press "Z" to shoot', { font: '"Press Start 2P"' });
            this.add.text(Player.x, Player.y-30, 'Press Space to jump and double jump', { font: '"Press Start 2P"' });
            this.add.text(Player.x, Player.y-20, 'Use the arrow keys to move and aim', { font: '"Press Start 2P"' });
            //donutCooldown is the amount of time it takes to reaload
            //donutTimer is the thing that is counting down
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
        map.getObjectLayer('StartButton').objects.forEach((StartButton) => {
            this.StartButton = this.physics.add.sprite(StartButton.x - 12, StartButton.y - StartButton.height, 'button').setScale(1);
            this.StartButton.body.immovable = true;
        });
        map.getObjectLayer('StartZone').objects.forEach((StartZone) => {
            this.StartZone = this.physics.add.sprite(StartZone.x, StartZone.y + StartZone.height / 2, 'empty').setSize(1, StartZone.height);
            this.StartZone.body.immovable = true;
        });
        map.getObjectLayer('NewLevel').objects.forEach((Zone) => {
            this.NewLevel = this.physics.add.sprite(Zone.x+Zone.width / 2, Zone.y + Zone.height / 2, 'empty').setSize(Zone.width, Zone.height);
            this.NewLevel.body.immovable = true;
        });
        map.getObjectLayer('Items').objects.forEach((Item) => {
            let random = Phaser.Math.FloatBetween(0, 10)
            this.Item = this.items.create(Item.x, Item.y, 'Powerups').setScale(1);
            if (random <= 1) {
                this.Item.anims.play('0', true);
                this.Item.setData({ type: 1 });
                this.add.text(Item.x, Item.y+40, '+ Increases Damage', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 2) {
                this.Item.anims.play('1', true);
                this.Item.setData({ type: 2 });
                this.add.text(Item.x, Item.y+40, '+ Increases JumpHeight', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 3) {
                this.Item.anims.play('2', true);
                this.Item.setData({ type: 3 });
                this.add.text(Item.x, Item.y+40, '+ Increases Donuts Airtime', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 4) {
                this.Item.anims.play('3', true);
                this.Item.setData({ type: 4 });
                this.add.text(Item.x, Item.y+40, '+ Increases Donut Speed\n+ Increases Aim', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 5) {
                this.Item.anims.play('4', true);
                this.Item.setData({ type: 5 });
                this.add.text(Item.x, Item.y+40, '+ Increases Amount Of Jumps', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 6) {
                this.Item.anims.play('5', true);
                this.Item.setData({ type: 6 });
                this.add.text(Item.x, Item.y+40, '+ Increases Amount Of Shots\n- Decreases Firerate', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 7) {
                this.Item.anims.play('6', true);
                this.Item.setData({ type: 7 });
                this.add.text(Item.x, Item.y+40, '+ Increases Player Speed', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 8) {
                this.Item.anims.play('7', true);
                this.Item.setData({ type: 8 });
                this.add.text(Item.x, Item.y+40, '+ Increases Firerate', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else if (random <= 9) {
                this.Item.anims.play('8', true);
                this.Item.setData({ type: 9 });
                this.add.text(Item.x, Item.y+40, '+ Increases Max Hp', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff' }).setOrigin(0.5,0);
            } else {
                this.Item.anims.play('9', true);
                this.Item.setData({ type: 10 });
                this.add.text(Item.x, Item.y+40, '+ SCATTERSHOT\n+ LETS GOOOOO', { font: '"Press Start 2P"', fontSize: '24px', color: '#fff'}).setOrigin(0.5,0);
            }

            if (Item.type == 0) {
                if (Phaser.Math.FloatBetween(0,1)<0.1) {
                    this.Item.setData({ level: 2 });
                    this.Item.setTint(0xffff00)
                    this.add.text(Item.x, Item.y-60, 'GOLDEN\nIncreased effect', { font: '"Press Start 2P"', fontSize: '48px', color: '#ff0', align: 'center', stroke: '#0', strokeThickness: 2}).setOrigin(0.5,0);
                } else {
                    this.Item.setData({ level: 1 });
                }
            } else {
                this.Item.setData({ level: 2 });
                this.Item.setTint(0xffff00)
                this.add.text(Item.x, Item.y-60, 'GOLDEN\nIncreased effect', { font: '"Press Start 2P"', fontSize: '48px', color: '#ff0', align: 'center', stroke: '#0', strokeThickness: 2}).setOrigin(0.5,0);
            }

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
            duration: 1500
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
        this.Shooters.children.iterate(function (child) {
            if (750>Math.sqrt(Math.pow(child.x-x,2)+Math.pow(child.y-y,2))) {
            var num = dis.Raycast(x, y, width, height, child);
            } else {
            var num = 1;
            }
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

        if (this.Shooters.countActive(true) == 0 && this.brawlers.countActive(true) == 0 && this.Started) {
            this.Door.destroy();
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

        this.Shooters = this.physics.add.group({});
        this.brawlers = this.physics.add.group({});

        this.pickups = this.physics.add.group({});
        this.items = this.physics.add.group({});
    }
    createHitboxes() {
        this.physics.add.collider(this.Shooters, this.platforms);
        this.physics.add.collider(this.donuts, this.platforms, this.split, null, this);
        this.physics.add.collider(this.donuts, this.StartDoor, this.split, null, this);
        this.physics.add.collider(this.donuts, this.Door, this.split, null, this);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.pickups, this.platforms);
        this.physics.add.collider(this.player, this.StartDoor);
        this.physics.add.collider(this.player, this.Door);
        

        this.physics.add.overlap(this.player, this.StartZone, this.start, null, this);

        this.physics.add.overlap(this.player, this.Shooters, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.brawlers, this.hitPlayer, null, this);
        this.physics.add.overlap(this.player, this.items, this.itemed, null, this);
        this.physics.add.collider(this.player, this.bosses, this.hitPlayer, null, this);

        this.physics.add.collider(this.player, this.NewLevel, this.NextLevel, null, this);

        this.physics.add.collider(this.bombs, this.platforms, this.destroyBullet, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.hitPlayerBomb, null, this);
        this.physics.add.overlap(this.donuts, this.Shooters, this.hitShooter, null, this);
        this.physics.add.overlap(this.donuts, this.brawlers, this.hitBrawler, null, this);
        this.physics.add.overlap(this.donuts, this.StartButton, this.hitButton, null, this);

        this.physics.add.overlap(this.player, this.pickups, this.pickuped, null, this);
    }

    moveMountains() {
        this.background11.x-=0.4
        this.background12.x-=0.4
        this.background13.x-=0.4
        if (this.background11.x<-900) {
            this.background11.x = this.background13.x+this.background13.width-40;
        }
        if (this.background12.x<-900) {
            this.background12.x = this.background11.x+this.background11.width-40;
        }
        if (this.background13.x<-900) {
            this.background13.x = this.background12.x+this.background12.width-40;
        }
        this.background21.x-=0.8
        this.background22.x-=0.8
        this.background23.x-=0.8
        if (this.background21.x<-900) {
            this.background21.x = this.background23.x+this.background23.width-40;
        }
        if (this.background22.x<-900) {
            this.background22.x = this.background21.x+this.background21.width-40;
        }
        if (this.background23.x<-900) {
            this.background23.x = this.background22.x+this.background22.width-40;
        }
        this.background31.x-=1.2
        this.background32.x-=1.2
        this.background33.x-=1.2
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
            this.player.setData('donutScale', this.player.getData('donutScale') + 0.2)
            if (item.getData('level')==2) {
                this.player.setData('damage', this.player.getData('damage') * 2)
            }
        } else if (item.getData('type') == 2) {
            this.player.setData('jumpHeight', this.player.getData('jumpHeight') * 1.25)
            if (item.getData('level')==2) {
                this.player.setData('jumpHeight', this.player.getData('jumpHeight') * 1.25)
            }
        } else if (item.getData('type') == 3) {
            this.player.setData('time', this.player.getData('time') * 3)
            if (item.getData('level')==2) {
                this.player.setData('time', this.player.getData('time') * 2)
            }
        } else if (item.getData('type') == 4) {
            this.player.setData('donutSpeed', this.player.getData('donutSpeed') + 150)
            this.player.setData('donutAim', this.player.getData('donutAim') + 3)
            if (item.getData('level')==2) {
                this.player.setData('donutSpeed', this.player.getData('donutSpeed') + 150)
                this.player.setData('donutAim', this.player.getData('donutAim') + 3)
            }
        } else if (item.getData('type') == 5) {
            this.player.setData('jumpsMax', this.player.getData('jumpsMax') + 2)
            if (item.getData('level')==2) {
                this.player.setData('jumpsMax', this.player.getData('jumpsMax') + 2)
            }
        } else if (item.getData('type') == 6) {
            this.player.setData('shots', this.player.getData('shots')+2)
            this.player.setData('donutCooldown', this.player.getData('donutCooldown') * 1.3)
            if (item.getData('level')==2) {
                this.player.setData('shots', this.player.getData('shots')+2)
            }
        } else if (item.getData('type') == 7) {
            this.player.setData('speed', this.player.getData('speed') + 75)
            if (item.getData('level')==2) {
                this.player.setData('speed', this.player.getData('speed') + 75)
            }
        } else if (item.getData('type') == 8) {
            this.player.setData('donutCooldown', this.player.getData('donutCooldown') * 0.7)
            if (item.getData('level')==2) {
                this.player.setData('donutCooldown', this.player.getData('donutCooldown') * 0.7)
            }
        } else if (item.getData('type') == 9) {
            this.player.setData('health', this.player.getData('health') + 3)
            this.player.setData('maxhealth', this.player.getData('maxhealth') + 3)
            if (item.getData('level')==2) {
                this.player.setData('health', this.player.getData('health') + 3)
            this.player.setData('maxhealth', this.player.getData('maxhealth') + 3)
            }
            this.lifesText.setText("lifes: " + player.data.values.health + " / " + player.data.values.maxhealth);
        } else {
            this.player.setData('donutSplits', this.player.getData('donutSplits') + 2)
            if (item.getData('level')==2) {
                this.player.setData('donutSplits', this.player.getData('donutSplits') + 2)
            }
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
            y: 480-16,
            duration: 1200,
            ease: 'Bounce'
        });
        maped.getObjectLayer('Brawlers').objects.forEach((Brawler) => {
            this.brawler = this.brawlers.create(Brawler.x, Brawler.y, 'brawler').setScale(0.5);
            this.brawler.setVelocityX(0);
            this.brawler.setVelocityY(0);
            this.brawler.setDataEnabled();
            this.brawler.setData({ health: 20 , type: 1});
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

    split(donut, _not) {
        if (donut.getData('splits') >= 2) {
            this.donut = this.donuts.create(donut.body.x + donut.body.width / 2, donut.body.y + donut.body.height / 2, 'donut');
            this.donut.setScale(this.player.getData('donutScale'));
            let tempangle = Phaser.Math.FloatBetween(0,2*Math.PI);
            this.donut.setVelocityX(Math.cos(tempangle) * this.player.getData('donutSpeed'))
            this.donut.setVelocityY(Math.sin(tempangle) * this.player.getData('donutSpeed'))
            this.donut.setBounce(this.player.getData('donutBounce'));
            this.donut.setGravityY(this.player.getData('donutGrav'));
            this.donut.setDataEnabled();
            this.donut.setData({ time: donut.getData('time'), damage: donut.getData('damage'), splits: donut.getData('splits') - 1 });
            donut.setData('splits', donut.getData('splits') - 1)
        }
    }

    NextLevel(_player, _zone) {
        this.NewLevel.destroy();
        this.tweens.add({
            targets: this.Fade,
            alpha: 1,
            duration: 2000,
            ease: 'Sine.easeInOut'
        });
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.Change()
            }
        });
    }
    Change(){
        this.scene.pause();
        this.scene.launch('PlayScene2', {player: this.player });
    }
}

export default PlayScene;

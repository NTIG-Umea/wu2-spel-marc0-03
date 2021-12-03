class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.gameOver = false;
        var lifesText;

        this.right=true;
        this.doh = this.sound.add('doh');
        //this.doh.play();

        //  A simple background for our game
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // skapa en tilemap från JSON filen vi preloadade
        const map = this.make.tilemap({ key: 'map' });
        // ladda in tilesetbilden till vår tilemap
        const tileset = map.addTilesetImage('jefrens_platformer', 'tiles');

        this.platforms = map.createLayer('Platforms', tileset);
        this.platforms.setCollisionByExclusion(-1, true);


    // The player and its settings
    this.player = this.physics.add.sprite(50, 280, 'dude');

    this.player.setBounce(0.9);
    this.player.setBounceY(0)
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(200)
    this.player.setDataEnabled();
    this.player.setData({iFrames:80,health: 3,donutCooldown: 5,donutTimer: 5,damage: 10,time: 140});
    //donutCooldown is the amount of time it takes to reaload
    //donutTimer is the thing that is counting down
    
    /*
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setLerp(0.1,0.1);
    */

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
            key: 'righttsnow',
            frames: this.anims.generateFrameNumbers('snowball', { start: 1, end: 2 }),
            frameRate: 20,
            repeat: -1
        });
    this.anims.create({
            key: 'leftsnow',
            frames: this.anims.generateFrameNumbers('snowball', { start: 0, end: 1 }),
            frameRate: 20,
            repeat: -1
        });
    this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
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

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis

    this.donuts = this.physics.add.group({
    });

    this.Shooters = this.physics.add.group({
    })

    this.brawlers = this.physics.add.group({
    })

    this.bombs = this.physics.add.group({
    })

    this.shooter = this.Shooters.create(this.player.body.x+100, this.player.body.y-50, 'shooter');
    this.shooter.setDataEnabled();
    this.shooter.setData({time: 0,type: 1,health: 10});
    this.brawler = this.brawlers.create(800, 300, 'brawler');
    this.brawler.setVelocityX(0);
    this.brawler.setVelocityY(0);
    this.brawler.setDataEnabled();
    this.brawler.setData({health: 20});

    this.lifesText = this.add.text(16, 16, 'lifes: 3', { fontSize: '32px', fill: '#00FF00' });
    this.lifesText.setScrollFactor(0);


    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.Shooters, this.platforms);
    this.physics.add.collider(this.donuts, this.platforms);
    this.physics.add.collider(this.player, this.platforms);

    this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this);
    this.physics.add.overlap(this.donuts, this.Shooters, this.hitShooter, null, this);
    this.physics.add.overlap(this.donuts, this.brawlers, this.hitBrawler, null, this);
        /*
        // från platforms som skapats från tilemappen
        // kan vi ladda in andra lager
        // i tilemappen finns det ett lager Spikes
        // som innehåller spikarnas position
        console.log(this.platforms);
        map.getObjectLayer('Spikes').objects.forEach((spike) => {
            // iterera över spikarna, skapa spelobjekt
            const spikeSprite = this.spikes
                .create(spike.x, spike.y - spike.height, 'spike')
                .setOrigin(0);
            spikeSprite.body
                .setSize(spike.width, spike.height - 20)
                .setOffset(0, 20);
        });

        // lägg till en keyboard input för W
        this.keyObj = this.input.keyboard.addKey('W', true, false);
        */
    }

    update() {
    this.player.tint = Phaser.Display.Color.GetColor(100*(this.player.data.values.iFrames/80)+155, 100*(this.player.data.values.iFrames/80)+155, 155*(this.player.data.values.iFrames/80)+100)
    if (this.player.getData('iFrames')!=80) {
        this.player.setData('iFrames', this.player.getData('iFrames')+1);
    }

    if (this.cursors.left.isDown && this.cursors.right.isDown){
        if (this.player.body.onFloor()) {
                if (this.player.body.velocity.x>0) {
            this.player.setVelocityX(this.player.body.velocity.x-2);
            }
        else if (this.player.body.velocity.x<0) {
            this.player.setVelocityX(this.player.body.velocity.x+2);
        }

            }
            this.player.anims.play('turn', true);
    } else if (this.cursors.left.isDown) {
            this.right=false;
            if (this.player.body.velocity.x>-360 && this.player.body.onFloor()) {
            this.player.setVelocityX(this.player.body.velocity.x-3);
            }
            

            this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.right=true;
        if (this.player.body.velocity.x<360  && this.player.body.onFloor()) {
        this.player.setVelocityX(this.player.body.velocity.x+3);
        }

        this.player.anims.play('right', true);
    } else {
        if (this.player.body.onFloor()) {
                if (this.player.body.velocity.x>0) {
            this.player.setVelocityX(this.player.body.velocity.x-2);
        } else if (this.player.body.velocity.x<0) {
            this.player.setVelocityX(this.player.body.velocity.x+2);
        }
            }
            this.player.anims.play('turn', true);
    }

    if (this.cursors.up.isDown && this.player.body.onFloor())
    {
        this.player.setVelocityY(-330);
        
    }


    if (this.cursors.space.isDown) {
        this.shooter = this.Shooters.create(this.player.body.x+100, this.player.body.y, 'shooter');
        this.shooter.body.setGravityY(300);
        this.shooter.setDataEnabled();
        if (Phaser.Math.FloatBetween(0,1)>=0.5) {
        this.shooter.setData({time: 0,type: 2,health: 10});
        this.shooter.setTint(0x0000ff)
        } else {
            this.shooter.setData({time: 0,type: 1,health: 10});
        }
        console.log("health =" + this.shooter.getData('health'))
    }
    if (this.cursors.down.isDown){
        if (this.player.getData('donutTimer')>=this.player.getData('donutCooldown')) {
            this.donut = this.donuts.create(this.player.body.x, this.player.body.y, 'donut');
            if (this.right) {
                this.donut.body.velocity.x = 500;
                this.donut.angle = 270;
            } else {
                this.donut.body.velocity.x = -500;
                this.donut.angle = 90;
            }
            this.donut.setBounce(0.8);
            this.donut.setGravityY(300);
            this.donut.setDataEnabled();
            this.donut.setData({time: this.player.getData('time'),damage: this.player.getData('damage')});
            this.donut.body.velocity.y = 0;
            this.player.setData('donutTimer', 0)
            console.log("damage =" + this.donut.getData('damage'))
    }}
    if (this.player.getData('donutTimer')!=this.player.getData('donutCooldown')) {
        this.player.setData('donutTimer', this.player.getData('donutTimer')+1);
    }

    /*
    this.brawlers.children.iterate(function (child) {
    let angle = Math.atan2((this.player.body.y-child.body.y),(this.player.body.x-child.body.x))
    child.body.setVelocityX(Math.cos(angle)*50)
    child.body.setVelocityY(Math.sin(angle)*50)
})
    this.Shooters.children.iterate(function (child) {
    if (child.getData('time')==100) {
        if (child.getData('type')==1) {
        let angle = Math.atan2((this.player.body.y-child.body.y),(this.player.body.x-child.body.x))
        this.bomb = this.bombs.create(child.body.x+32, child.body.y+32, 'bomb');
        let speed = 500;
        this.bomb.setDataEnabled();
        this.bomb.setData({time: 100, type: 1});
        this.bomb.setVelocityX(Math.cos(angle)*speed)
        this.bomb.setVelocityY(Math.sin(angle)*speed)
        this.bomb.setCollideWorldBounds(true);
        this.bomb.body.setGravityY(0);
        } else if (child.getData('type')==2) {
            for (let i = 0; i<3; i++) {
        let angle = Math.atan2((this.player.body.y-child.body.y),(this.player.body.x-child.body.x))+(i*0.1-0.1)
        this.bomb = this.bombs.create(child.body.x+32, child.body.y+32, 'bomb');
        let speed = 500;
        this.bomb.setDataEnabled();
        this.bomb.setData({time: 100, type: 1});
        this.bomb.setVelocityX(Math.cos(angle)*speed)
        this.bomb.setVelocityY(Math.sin(angle)*speed)
        this.bomb.setCollideWorldBounds(true);
        this.bomb.body.setGravityY(0);
            }
        }
        child.data.values.time=0;
    } else {
        child.data.values.time += 1;
    }
    })
    */

    if (this.bombs.countActive(true)!=0) {
    this.bombs.children.iterate(function (child) {
        if (child!=null) {
        if (child.getData('time')==0) {
            child.destroy();
        } else {
            child.data.values.time -= 1;
        }}})}

        if (this.donuts.countActive(true)!=0) {
    this.donuts.children.iterate(function (child) {
        if (child!=null) {
        if (child.getData('time')==0) {
            child.destroy();
        } else {
            child.setData('time', child.getData('time')-1);
        }}})}
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
    
hitShooter (donut, shooter) {
    console.log("health =" + shooter.getData('health')+ " damage = " + donut.getData('damage'))
    shooter.setData('health', shooter.getData('health') - donut.getData('damage'))
    console.log(shooter)
    if (shooter.getData('health')<=0) {
        shooter.destroy();
    }
    donut.destroy();
};
hitBrawler (donut, brawler) {
    brawler.data.values.health -= donut.getData('damage');
    if (brawler.getData('health')<=0) {
        brawler.destroy();
    }
    donut.destroy();
}

hitBomb (player, bomb)
{
    if (player.getData('iFrames')==80) {
        player.data.values.health-=1;
        lifesText.setText("lifes: " + player.data.values.health); 
        if (player.data.values.health==0){
            this.physics.pause();

            player.setTint(0xff0000);
            player.anims.play('turn');
            
            gameOver = true;
        }
        player.data.values.iFrames = 0;
    }
    
}
}

export default PlayScene;

import Phaser from "phaser";
import skyImg from "../assets/sky3.png";
import bird from "../assets/bird.png";
import groundTileSmall from "../assets/groundTile16.png";
import groundTileBig from "../assets/groundTile32.png";
import platform from "../assets/platform.png";

// Declare game variables
let player;
let ground;
let platforms;
let cursors;
let gameOver = false;
let tilesprite;
let mainGround;

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image('skyImg', skyImg);
    this.load.image('groundTileSmall', groundTileSmall);
    this.load.image('groundTileBig', groundTileBig);
    this.load.image('platform', platform);
    this.load.spritesheet('bird', bird, { frameWidth: 79.5, frameHeight: 90 });
  }

  create() {
    // Add background
    // TODO: repeat background image
    let bg = this.add.image(0, 0, 'skyImg').setOrigin(0, 0);


    // Create a tilesprite (x, y, width, height, key)
    mainGround = this.add.tileSprite(0, 0, 16, 16, 'groundTileSmall');
    this.physics.add.existing(mainGround, true);

    // Setup platforms - static group of physics objects
    platforms = this.physics.add.staticGroup();

    // This is the floor, basically
    // platforms.create(400, 568, 'platform').setScale(2.5).refreshBody();
    // platforms.create(32, 568, 'groundTileBig').setScale(1).refreshBody();

    // Setup player - dynamic physics object
    player = this.physics.add.sprite(100, 450, 'bird');
    player.setBounce(0.2);

    // Ok so Im working with this now to enable side scrollin
    player.setCollideWorldBounds(true);

    // Game object positioning
    // Set a random position for a game object
    // player.setRandomPosition(0, 0, 800, 600);
    // Set player initial position
    player.x = 0;
    player.y = 500;

    // experiment time
    // FUCKING YES
    // This sets the world to wider than the scene's current view AKA now we have a side scroller
    this.physics.world.setBounds(0, 0, 5000, 600);
    // this.scene.setBounds(0, 0, 5000, 600);

    // Next up, lets test collision with stuff!!!

    // This pauses/resumes the scene
    // this.physics.pause();
    // scene.physics.world.on('pause', function() { /* ... */ });
    // this.physics.resume();
    // scene.physics.world.on('resume', function() { /* ... */ });

    player.setScale(.8);

    // // Resize the game world for side scrolling goodness
    // this.game.world.setBounds(0, 0, 5000, 600);
    // this.physics.world.setBounds(x, y, 5000, 600);

    // Set the bounds of the camera to the size of the background
    this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
    // Tell the camera to follow the player
    this.cameras.main.startFollow(player);

    // Player controls
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
      frameRate: 10,
      // repeat -1 tells the animation to loop
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('bird', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'bird', frame: 4 }],
      frameRate: 10,
      repeat: -1,
    });

    cursors = this.input.keyboard.createCursorKeys();

    // Setup collision
    this.physics.add.collider(player, platforms);

    // See if 2 objects are overlapping collision
    // var isOverlapping = scene.physics.world.overlap(object1, object2);

    // Setup camera
    // this.camera.follow(player);

    // this.tweens.add({
    //   targets: logo,
    //   y: 450,
    //   duration: 2000,
    //   ease: "Power2",
    //   yoyo: true,
    //   loop: -1
    // });
  }

  update() {
    if (gameOver) {
      return;
    }
    // yall its walking time
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // Player jump
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
  }
}

export default playGame;

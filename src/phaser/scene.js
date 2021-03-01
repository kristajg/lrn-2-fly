import Phaser from "phaser";
import skyBackground from "../assets/sky2.png";
import bird from "../assets/bird.png";
import toastSpriteSheet from "../assets/toastSpriteSheet.png";
import groundTile from "../assets/groundTile.png";
import platform from "../assets/platform.png";

// Declare game variables
let player;
let mainGround;
let platforms;
let toasts;
let cursors;
let score = 0;
let scoreText = '';
let gameOver = false;

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image('skyBackground', skyBackground);
    this.load.image('groundTile', groundTile);
    this.load.image('platform', platform);
    this.load.spritesheet('toast', toastSpriteSheet, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bird', bird, { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    // Add background, set up to repeat horizontally with scrolling
    // Note: Changing the scroll factor to higher amt increase the speed of scroll
    let skyTile = this.add.tileSprite(0, 0, 5000, 600, 'skyBackground').setOrigin(0, 0).setScrollFactor(2);
    skyTile.fixedToCamera = true;
    // An easier option for background color
    // this.cameras.main.setBackgroundColor(0x1D1923);

    // Setup platforms - static group of physics objects
    platforms = this.physics.add.staticGroup();

    // Create the platforms
    // TODO: figure out why does setScale() on a platform not update the collision box?
    platforms.create(550, 450, 'platform');
    platforms.create(850, 350, 'platform');
    platforms.create(1450, 550, 'platform');
    platforms.create(2000, 450, 'platform');

    // Create groups of good items
    // TODO: add second type of good item
    toasts = this.physics.add.staticGroup();
    // TODO: figure out what enableBody means
    // toasts.enableBody = true;
    toasts.create(500, 390, 'toast');
    toasts.create(550, 390, 'toast');
    toasts.create(600, 390, 'toast');

    // Set up the ground floor
    mainGround = this.add.tileSprite(0, 600, 5000, 100, "groundTile");
    this.physics.add.existing(mainGround, true);

    // Setup player - dynamic physics object
    player = this.physics.add.sprite(100, 450, 'bird');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Game object positioning
    // Set a random position for a game object
    // player.setRandomPosition(0, 0, 800, 600);
    // Set player initial position
    player.x = 0;
    player.y = 700;

    // This sets the world to wider than the scene's current view AKA now we have a side scroller
    this.physics.world.setBounds(0, 0, 5000, 600);

    // This pauses/resumes the scene
    // this.physics.pause();
    // scene.physics.world.on('pause', function() { /* ... */ });
    // this.physics.resume();
    // scene.physics.world.on('resume', function() { /* ... */ });

    // Alter scale of sprites & tiles
    // player.setScale(1.2);
    // mainGround.setScale(1.2);

    // Set the bounds of the camera to the size of the background
    this.cameras.main.setBounds(0, 0, skyTile.displayWidth, skyTile.displayHeight);

    // Tell the camera to follow the player
    this.cameras.main.startFollow(player);

    // Animate toast && play on load
    const toastAnimation = this.anims.create({
      key: 'toastSpin',
      frames: this.anims.generateFrameNumbers('toast', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    toasts.playAnimation({ key: 'toastSpin' });

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
    this.physics.add.collider(player, mainGround);
    this.physics.add.collider(toasts, platforms);
    this.physics.add.collider(toasts, mainGround);

    // Setup text
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // Overlap events
    this.physics.add.overlap(player, toasts, this.collectItem, null, this);
    // See if 2 objects are overlapping collision
    // var isOverlapping = scene.physics.world.overlap(object1, object2);
  }

  update() {
    if (gameOver) {
      return;
    }
  
    // Player walk
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
    // TODO: add jump & crouch art / animation. update the spritesheet to add frames
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }

  collectItem (player, item) {
    // TODO: different items are worth different points
    item.disableBody(true, true);
    score += 10;
    scoreText.setText(`Updated score be like: ${score}`);
  }
}

export default playGame;

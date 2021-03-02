// Third party libraries
import Phaser, { Animations } from 'phaser';

// Images
import skyBackground from '../assets/sky2.png';
import bird from '../assets/birdSpriteSheet.png';
import toast from '../assets/toastSpriteSheet.png';
import snake from '../assets/snakeSpriteSheet.png';
import groundTile from '../assets/groundTile.png';
import platform from '../assets/platform.png';

// Animations
import { createSnakeAnims } from '../anims/enemyAnims';
import { createPlayerAnims } from '../anims/playerAnims';
import { createToastAnims } from '../anims/itemAnims';

// Declare game variables
let player;
let mainGround;
let platforms;
let toasts;
let snakes;
let cursors;
let score = 0;
let scoreText = '';
let gameOver = false;

class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }

  preload() {
    this.load.image('skyBackground', skyBackground);
    this.load.image('groundTile', groundTile);
    this.load.image('platform', platform);
    this.load.spritesheet('toast', toast, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('snake', snake, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('bird', bird, { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    // Initialize animations
    createPlayerAnims(this.anims);
    createToastAnims(this.anims);
    createSnakeAnims(this.anims);

    // Add background, set up to repeat horizontally with scrolling
    // Note: Changing the scroll factor to higher amt increase the speed of scroll
    let skyTile = this.add.tileSprite(0, 0, 5000, 600, 'skyBackground').setOrigin(0, 0).setScrollFactor(2);
    skyTile.fixedToCamera = true;
    // Note: An easier option for background color
    // this.cameras.main.setBackgroundColor(0x1D1923);

    // Create platforms: group of static objects
    platforms = this.physics.add.staticGroup();

    // Place the platforms
    platforms.create(550, 450, 'platform');
    platforms.create(850, 350, 'platform');
    platforms.create(1450, 550, 'platform');
    platforms.create(2000, 450, 'platform');

    // Create bonus items: group of static objects
    // TODO: add second type of 'good' item: cakes
    toasts = this.physics.add.staticGroup();

    // Place the bonus items
    toasts.create(500, 390, 'toast');
    toasts.create(550, 390, 'toast');
    toasts.create(600, 390, 'toast');

    // Create groups of enemies
    snakes = this.physics.add.group();

    // Place the enemies
    snakes.create(150, 500, 'snake', 3);

    // Create the ground floor
    mainGround = this.add.tileSprite(0, 600, 5000, 100, 'groundTile');
    this.physics.add.existing(mainGround, true);

    // Create player: dynamic physics object
    player = this.physics.add.sprite(100, 450, 'bird');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Game object positioning
    // Note: You can set a random position for a game object
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

    // Play toast animation by default
    toasts.playAnimation({ key: 'toastSpin' });

    // Create snake group (enemy)
    // TODO: make enemy move logic / separate out into own function
    // snakes.setVelocityX(380);
    // snakes.playAnimation('snakeMoveRight', true);
    // I think I might need to do a tween? for the sneks
    snakes.playAnimation({ key: 'snakeMoveRight' });

    // this.tweens.add({
    //   targets: snakes,
    //   x: 750,
    //   duration: 2000,
    //   ease: 'Linear',
    // });

    // snakes.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim, frame, gameObj) => {
    //   console.log('hello! ', frame);
    // });

    // let snakeTween = this.tweens.add({
    //   targets: snakes,
    //   alpha: 1,
    //   // alpha: '+=1',
    //   // alpha: { from: 0, to: 1 },
    //   // alpha: { start: 0, to: 1 },  
    //   // alpha: { start: value0, from: value1, to: value2 },  
    //   // alpha: function(target, key, value, targetIndex, totalTargets, tween)  { return newValue; },
    //   // alpha: {
    //   //      getActive: function (target, key, value, targetIndex, totalTargets, tween) { return newValue; },
    //   //      getStart: function (target, key, value, targetIndex, totalTargets, tween) { return newValue; },
    //   //      getEnd: function (target, key, value, targetIndex, totalTargets, tween) { return newValue; }
    //   // },
    //   ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
    //   duration: 1000,
    //   repeat: -1,            // -1: infinity
    //   yoyo: false
    // });

    cursors = this.input.keyboard.createCursorKeys();

    // Setup collision
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, mainGround);
    this.physics.add.collider(toasts, platforms);
    this.physics.add.collider(toasts, mainGround);
    this.physics.add.collider(snakes, mainGround);
    this.physics.add.collider(snakes, platform);

    // Setup text
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // Setup overlap events
    this.physics.add.overlap(player, toasts, this.collectItem, null, this);
    this.physics.add.overlap(player, snakes, this.damagePlayer, null, this);
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
    // TODO: add idle, jump, run animations to sprite sheet
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }

  collectItem (player, item) {
    // TODO: different items are worth different points
    console.log('item is ', item);
    item.disableBody(true, true);
    score += 10;
    scoreText.setText(`Score is: ${score}`);
  }

  damagePlayer (player, enemy) {
    console.log('damage player triggered ', enemy);
  }
}

export default playGame;

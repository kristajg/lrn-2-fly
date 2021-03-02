export const createSnakeAnims = (anims) => {
  anims.create({
    key: 'snakeMoveLeft',
    frames: anims.generateFrameNumbers('snake', { start: 0, end: 2 }),
    frameRate: 2,
    repeat: 2,
  });

  anims.create({
    key: 'snakeMoveRight',
    frames: anims.generateFrameNumbers('snake', { start: 2, end: 4 }),
    frameRate: 2,
    repeat: 2,
  });
};

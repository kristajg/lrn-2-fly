export const createPlayerAnims = (anims) => {
  anims.create({
    key: 'left',
    frames: anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: 'right',
    frames: anims.generateFrameNumbers('bird', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: 'turn',
    frames: [{ key: 'bird', frame: 4 }],
    frameRate: 10,
    repeat: -1,
  });
};

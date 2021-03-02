export const createToastAnims = (anims) => {
  anims.create({
    key: 'toastSpin',
    frames: anims.generateFrameNumbers('toast', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
};

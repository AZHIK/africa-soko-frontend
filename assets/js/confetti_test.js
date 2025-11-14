const count = 200;
const defaults = { origin: { y: 1.0 } };

function fireAll() {
  const bursts = [
    { particleRatio: 0.25, opts: { spread: 26, startVelocity: 55 } },
    { particleRatio: 0.2, opts: { spread: 60 } },
    { particleRatio: 0.35, opts: { spread: 100, decay: 0.91, scalar: 0.8 } },
    { particleRatio: 0.1, opts: { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 } },
    { particleRatio: 0.1, opts: { spread: 120, startVelocity: 45 } },
  ];

  bursts.forEach(burst => {
    confetti(
      Object.assign({}, defaults, burst.opts, {
        particleCount: Math.floor(count * burst.particleRatio),
      })
    );
  });
}
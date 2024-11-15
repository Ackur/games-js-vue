import { Dust, Fire } from "./components/Particles";

export const useParticles = (game) => {
  let particles = [];
  const maxParticles = 50;

  function addFire(x, y) {
    particles.unshift(new Fire(game, x, y));
  }

  function addDust(x, y) {
    particles.unshift(new Dust(game, x, y));
  }

  function update() {
    particles.forEach((particle, index) => {
      particle.update();
      if (particle.markedForDeletion) particles.splice(index, 1);
    });

    if (particles.length > maxParticles) {
      particles.slice(0, maxParticles);
    }
  }

  function draw() {
    // draw particles
    particles.forEach((particle) => {
      particle.draw();
    });
  }

  return { addDust, addFire, update, draw };
};

// Boundary Class
class Boundary {
  // Boundary Width & Height
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    // The " c.fillStyle = "rgba(255, 0, 0, 0.0)" " is more of a debugging tool for the boundaries
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    // The Boundaries are drawn as a rectangle.
    // Position is the where the boundary is placed (kinda obvious).
    // Width & Height are the width and height of the boundary (I should probably become a detective... xD).
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

// Sprite Class
class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    isEnemy = false,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.health = 100;
    this.isEnemy = isEnemy;
  }

  draw() {
    c.save();
    // " c.globalAlpha = this.opacity " is used for the "flinching" animation
    c.globalAlpha = this.opacity;
    // " c.drawImage(...) " is used render all sprites in the game
    c.drawImage(
      // " this.image " is the image of the sprite we want to render
      this.image,
      // the code below crops the image for each frame
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();

    // The following code below is responsible for the animation of every sprite.

    // If the sprite is not animated, the function will return
    if (!this.animate) return;

    // If the sprites maximum amount of frames is greater than 1, the elapsed frames will increase
    // which will crop the image for each frame.
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    // If the elapsed frames is greater than the hold frames, the frame value will increase
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      // If the frame value is greater than the maximum amount of frames, the frame value will reset
      // effectively looping the animation :)
      else this.frames.val = 0;
    }
  }

  attack({ attack, target }) {
    switch (attack.name) {
      case "Ember":

        break;
      case "Poison Shot":

        break;
      case "Tackle":
      case "Bite":
        // GSAP Timeline
        const gsapTL = gsap.timeline();

        // This simply updates the health "value" of the Pokémon
        this.health -= attack.damage;

        // Differing moving distance animation for player & enemy
        let moveDistance = 20;
        if (this.isEnemy) moveDistance = -20;

        // Differing health bar for player & enemy
        let healthBar = "#hampter-currhp";
        if (this.isEnemy) healthBar = "#nohtyp-currhp";

        // Attack Animation
        gsapTL
          .to(this.position, {
            // Attcking Pokémon charges the tackle/bite
            x: this.position.x - moveDistance,
          })
          .to(this.position, {
            // Attacking Pokémon then releases the tackle/bite
            x: this.position.x + moveDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy Takes Damage
              gsap.to(healthBar, {
                width: this.health + "%",
              });

              // Targeted Pokémon Flinches (moves side to side)
              gsap.to(target.position, {
                x: target.position.x + 20,
                yoyo: true,
                repeat: 5,
                duration: 0.06,
              });

              // Targeted Pokémon flashed
              gsap.to(target, {
                opacity: 0,
                yoyo: true,
                repeat: 5,
                duration: 0.06,
              });
            },
            // Attacking Pokémon returns to original positions
          })
          .to(this.position, {
            x: this.position.x,
          });

        break;
    }
  }
}

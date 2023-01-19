// Boundary Class
class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}


// Sprite Class
class Sprite {
  constructor({ position, image, frames = { max: 1, hold: 10 }, sprites, animate = false }) {
    this.position = position
    this.image = image
    this.frames = {...frames, val: 0, elapsed: 0}

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    c.restore()

    if (!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }

  attack({attack, target}) {
    const gsapTL = gsap.timeline()

    gsapTL.to(this.position, {
      x: this.position.x - 20,
    }).to(this.position, {
      x: this.position.x + 40,
      duration: 0.1,
      onComplete: () => {
        gsap.to(target.position, {
          x: target.position.x + 20,
          yoyo: true,
          repeat: 5,
          duration: 0.06,
        })

        gsap.to(target, {
          opacity: 0,
          yoyo: true,
          repeat: 5,
          duration: 0.06,
        })
      }
      }).to(this.position, {
        x: this.position.x,
      })
  }
}

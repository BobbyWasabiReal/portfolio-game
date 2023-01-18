// Canvas
const canvas = document.querySelector("canvas");

// Canvas Context
const c = canvas.getContext("2d");
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

canvas.width = 1024;
canvas.height = 576;

// Collisions
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 100) {
  collisionsMap.push(collisions.slice(i, 100 + i));
}

// Boundaries & Offset
const boundaries = [];
const offset = {
  x: -1584,
  y: -1322,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 211)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x + 4,
            y: i * Boundary.height + offset.y + 3,
          },
          width: 48,
          height: 48,
        })
      );
  });
});

// battleZones
const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 100) {
  battleZonesMap.push(battleZonesData.slice(i, 100 + i));
}

const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 808)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x + 4,
            y: i * Boundary.height + offset.y + 3,
          },
          width: 48,
          height: 48,
        })
      );
  });
});



// Images
// 1. Background
const image = new Image();
image.src = "./images/Map.png";

// 2. Foreground
const foregroundImage = new Image();
foregroundImage.src = "./images/Foreground.png";

// 3. Player
const playerDown = new Image();
playerDown.src = "./images/Characters/RedNinja/WalkDown.png";

// Keys
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

// Player
const player = new Sprite({
  position: {
    x: canvas.width / 2 - 176 / 4 / 2,
    y: canvas.height / 2 - 44 / 2,
  },
  image: playerDown,
  frames: {
    max: 4,
  },
  // Player Animations
  sprites: {
    up: playerDown,
    left: playerDown,
    right: playerDown,
    down: playerDown
  },
});

// Background
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

// Foreground
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});

// Movables Array
const movables = [background, ...boundaries, foreground, ...battleZones];

// Collision Function
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

// Battle Object
const battle = {
  initiated: false,
}

// Animation Loop
function animate() {
  const animationId = window.requestAnimationFrame(animate)
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw()
  })
  battleZones.forEach((battleZone) => {
    battleZone.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true
  player.moving = false
  if (battle.initiated) return

  // BattleZone detection & activation
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea =
        (Math.min( player.position.x + player.width, battleZone.position.x + battleZone.width) 
          - Math.max(player.position.x, battleZone.position.x))
          * (Math.min( player.position.y + player.height, battleZone.position.y + battleZone.height)
          - Math.max(player.position.y, battleZone.position.y))
        
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) && 
        overlappingArea > (player.width * player.height) / 2
        && Math.random() < 0.01
      ) {
        console.log('battle initiated')
        // deactivate current animation loop
        window.cancelAnimationFrame(animationId)
        battle.initiated = true
        gsap.to('#transition', {
          opacity: 1,
          repeat: 4,
          yoyo: true,
          duration: .3,
          onComplete() {
            gsap.to('#transition', {
              opacity: 1,
              duration: 0.4,
            }),
            
            // activate battle animation loop
            animateBattle();
          }
        })
        break
      }
    }
  }

  // Player Boundaries & Animations For Each Key
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3
      })
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3
      })
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3
      })
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3
      })
  }
}
animate()

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  console.log('battle animation loop')
}

/*----- Event Listeners -----*/

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

/*-- Pokémon --*/

// Hampter
const HampterImage = new Image()
HampterImage.src = './Images/Characters/Pokemon/Hampter.png'

const Hampter = new Sprite({
  name: 'Hampter',
  position: {
    x: 730,
    y: 190
  },
  image: HampterImage,
  frames: {
    max: 4,
    hold: 28
  },
  animate: true,
  isEnemy: true
})

// Nohtyp
const NohtypImage = new Image()
NohtypImage.src = './Images/Characters/Pokemon/Nohtyp.png'

const Nohtyp = new Sprite({
  name: 'Nohtyp',
  position: {
    x: 230,
    y: 390
  },
  image: NohtypImage,
  frames: {
    max: 4,
    hold: 18
  },
  animate: true,
})


/*-- Battle Animation Loop --*/
// The rendered sprites array is used to render the sprites in the battle animation loop,
// this is used to create depth in the battle animation loop.
// That way the player's Pokémon sprite (Nohtyp) will be rendered on top of the Ember & Poison Shot sprite, and
// both moves are rendered on top of the enemy's Pokémon (Hampter).
const renderedSprites = [Hampter, Nohtyp]
// Battle Animation Loop
function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  });
}
animateBattle();


/*-- Event Listeners --*/

const queue = []
// Attack Event Listener
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
    // selectedAttack is the attack that the player selected
    const selectedAttack = attacks[e.currentTarget.innerHTML]

    // Player's Pokémon attacks with the selected attack
    Nohtyp.attack({
      attack: selectedAttack,
      target: Hampter,
      renderedSprites
    })

    // Enemy's Pokémon attacks with a random attacka
    queue.push(() => {
      Hampter.attack({
        attack: attacks.Tackle,
        target: Nohtyp,
        renderedSprites
      })

    })
  })
})

// Battle Text Event Listener
document.querySelector('#battle-text').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
/*-- Pokémon --*/

// Hampter Pokémon
const Hampter = new Pokemon(pokemon.Hampter);

// Nohtyp Pokémon
const Nohtyp = new Pokemon(pokemon.Nohtyp);


/*-- Battle Animation Loop --*/
// The rendered sprites array is used to render the sprites in the battle animation loop,
// this is used to create depth in the battle animation loop.
// That way the player's Pokémon sprite (Nohtyp) will be rendered on top of the Ember & Poison Shot sprite, and
// both moves are rendered on top of the enemy's Pokémon (Hampter).
const renderedSprites = [Hampter, Nohtyp];

// The buttons for the attacks are created here
Nohtyp.attacks.forEach((attack) => {
  const button = document.createElement('button');
  button.innerHTML = attack.name;
  button.setAttribute('class', 'atk-button');
  document.querySelector('#attack-interface').append(button)
})

// Battle Animation Loop
function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}
animateBattle();


/*-- Event Listeners --*/

const queue = [];
// Attack Event Listener
document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', (e) => {
    // selectedAttack is the attack that the player selected
    const selectedAttack = attacks[e.currentTarget.innerHTML]

    // attacksRNG selects a random attack from the enemy's attacks
    const attacksRNG = Hampter.attacks[Math.floor(Math.random() * Hampter.attacks.length)]

    // Player's Pokémon attacks with the selected attack
    Nohtyp.attack({
      attack: selectedAttack,
      target: Hampter,
      renderedSprites
    })

    // If enemy Pokémon's health is 0 or less, the enemy faints
    if (Hampter.health <= 0) {
      queue.push(() => {
        Hampter.faint();
      })
      queue.push(() => {
        // After the enemy faints, the game fades back to the map
        gsap.to('#transition', {
          opacity: 1,
          onComplete: () => {
            cancelAnimationFrame(animateBattle);
          }
        })
      })
      
    }
    // Enemy's Pokémon attacks with a random attack
    // However, we transition between turns by pushing the attack into a queue
    // (hence the queue.push).
    queue.push(() => {
      Hampter.attack({
        attack: attacksRNG,
        target: Nohtyp,
        renderedSprites
      })

      // If player's Pokémon's health is 0 or less, the player faints
      if (Nohtyp.health <= 0) {
        queue.push(() => {
          Nohtyp.faint();
        })
      }
    })
  
  })

  button.addEventListener('mouseover', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    document.querySelector('#attack-info').innerHTML = (`Type: ${selectedAttack.type} Damage: ${selectedAttack.damage}`)
  })
})

// Battle Text Event Listener
document.querySelector('#battle-text').addEventListener('click', (e) => {
  // If the queue is not empty (meaning there is an attack in the queue), the attack will be executed
  // then removed from the queue.
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
    // If the queue is empty, the battle text will be hidden.
    // Effectively transitioning between turns.
  } else e.currentTarget.style.display = 'none'
})
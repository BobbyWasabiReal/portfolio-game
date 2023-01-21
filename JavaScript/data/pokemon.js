// Nohyp Image
const NohtypImage = new Image()
NohtypImage.src = './Images/Characters/Pokemon/Nohtyp.png'

// Hampter Image
const HampterImage = new Image()
HampterImage.src = './Images/Characters/Pokemon/Hampter.png'

// Pokémon Info
const pokemon = {
  Nohtyp: {
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
      attacks: [
        attacks.Tackle,
        attacks.Bite,
        attacks.Ember,
        attacks['Poison Shot'],
      ]
    },
    Hampter: {
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
      isEnemy: true,
      attacks: [
        attacks.Tackle,
        attacks.Bite,
        attacks.Ember,
        attacks['Poison Shot'],
      ]
    }
  }
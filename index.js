/*----- Cached Elements  -----*/

// Canvas
const canvas = document.querySelector("canvas");
  canvas.width = 1024;
  canvas.height = 576;

/*----- Constants -----*/
// Image
const image = new Image();
image.src = './images/Map.png'

// Canvas Context
const c = canvas.getContext("2d");
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
    image.onload = function() {
      c.drawImage(image, -1580, -1250);
    }


/*----- State Variables -----*/

/*----- Event Listeners -----*/


console.log(c);
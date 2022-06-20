// This will store the colors and the ints we use for sorting.
const values = [];

// This is used to randomize the values later on.
let store = [];

// This tells how many lines are used to make the circle.
let lines = 500;

// This flag is used to check if the sort is finished.
let retart = false;

// This flag is used to keep track of which sort the user
// has chosen in the dropdown
let chosenSort = 0

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a text input at the top-left of the screen to ask for lines.
  let inp = createInput('500');
  inp.position(0, height * 0.03);
  inp.size(100);
  inp.input(handleTextInput);

  // Create a button that starts the sorting loop.
  let button = createButton('Start');
  button.position(100, height * 0.03);
  button.mousePressed(handleButton);

  // Create a select box so the user can pick which sort to run
  sel = createSelect();
  sel.position(0, height * 0.1);
  sel.option('Bubble Sort');
  sel.option('Radix Sort');
  sel.changed(handleDropdown);

  // We don't want draw() to loop until after the button is pressed.
  noLoop();
}

// This is how we deal with the user changing sort funcions
function handleDropdown() {
  if (sel.value() === 'Bubble Sort') {
    chosenSort = 0;
  }

  else if (sel.value() === 'Radix Sort') {
    chosenSort = 1;
  }

  doRestart();
}

// Just set the lines variable to the user provided input.
function handleTextInput() {
  lines = parseFloat(this.value());
}

// This run variable is used to prevent the actual sort from happening.
let run;

function handleButton() {
  // Reset run to false so we don't even draw a circle before doRestart();
  run = false;

  // Prevent the draw() function from looping.
  noLoop();

  // This is described further down in the function decleration.
  doRestart();

  // Allows the circle to be drawn again.
  run = true;

  // Lets draw() loop continuously.
  loop();
}

// The first variable is used to draw an un-shuffled color wheel.
let first = true;

// The count variable is used as in index later on.
let count = 0;

function draw() {
  drawBackground();

  fill(255);


  text('How many lines?', 0, height * 0.02);
  text('What sort to use?', 0, height * 0.09);

  // If the start button has been pressed.
  if (run) {
    // Explanation in the function decleration further down.
    drawCircle(lines);

    // If this is the first time that the loop as been run after the start button is pressed.
    if (first) {
      // Grab a random element from "store"
      let val = random(store);

      // Set the values at the current index "count" to that random element.
      values[count] = val;

      // Remove the random element we grabbed earlier from the store array.
      store.splice(store.indexOf(val), 1);

      // Increment count, a.k.a the index.
      count += 1;

      // If we have gone through every single element in the values array.
      if (count === values.length) {
        first = false;
      }
    } else {
      
      if (chosenSort === 0) {
        bubbleSort();
      }

      else if (chosenSort === 1) {
        radixSort();
      }
    }
  } 
  
  // Get a circle so the screen isn't just black before the user presses Start.
  else {
    drawCircle(lines);
  }
}

// Just makes a black background.
function drawBackground() {
  fill(0);
  noStroke();
  rect(0, 0, width, height);
}

// This function will create the coordinates for the lines that compose
// the circle.
function drawCircle(lines) {
  let index = 0;

  // This for loop sets i to the angle the line should be at based on
  // how many lines there are total (360 / lines).
  for (let i = 0; i < 360; i += 360 / lines) {
    // Get the endpoint of the lin.
    let end = getXY(i);

    // This is the center of the canvas (screen in this case)
    let center = [width / 2, height / 2];

    // Set the color of the line
    stroke(
      values[index][0], 
      values[index][1],
      values[index][2]
    )

    // Actually create the line.
    line(center[0], center[1], end[0] + center[0], end[1] + center[1]);

    index += 1;
  }
}

// This function will take an angle in degrees, convert it to radians,
// and then calculate the (x, y) coordinates of the intersection between a line
// starting at (0, 0) and a circle of radius 200.
function getXY(deg) {
  let rad = deg * (Math.PI / 180);

  let x = 200 * Math.cos(rad);
  let y = 200 * Math.sin(rad);

  return [x, y];
}

// This function is where we handle some intialization for the sorting loop.
function doInit() {
  // This is the first color we want to start with (Red).
  let last = [255, 0, 0];

  // Just want to store this to clean up some code.
  let delta = (255 * 3) / lines;

  // These two variables are used to check progress. See below.
  let first = true;
  let second = false;
  
  // Same as the other for loop. It goes through all of the angles each line should be.
  for (let i = 0; i < 360; i += 360 / lines) {
    // Insert the color and the angle for each line into the values array.
    values.push([last, Math.floor(i)]);

    // If we are going from red to green then "first" is going to be true.
    if (first) {
      // This will take the last color added to the array and increment it towards the color green.
      last = [last[0] - delta, last[1] + delta, last[2]];

      // If there is no more red in last (rgb(0, 255, 0)) then set first to false
      // and second to true
      if (last[0] <= 0) {
        first = false;
        second = true;
      }
    } 
    
    // Since there is no more red in the last array, this loop now needs to run.
    else if (second) {
      // Slowly increments the last color from pure green to pure blue.
      last = [last[0], last[1] - delta, last[2] + delta];

      // If there is no more green left, set second to false.
      if (last[1] <= 0) {
        second = false;
      }
    } 
    
    // Since both second and first are false, we know that all we have now is blue.
    else {
      // Now we want to increment from pure blue to pure red.
      last = [last[0] + delta, last[1] - delta, last[2] - delta];
    }
  }

  // Set store equal to values so we can use it later.
  store = [...values];
}

// This is the bubble sorting function.
function bubbleSort() {
  // This is a flag used to check when we need to restart.
  let restart = true;

  // For each of  the lines we created inside of doInit()
  for (let i = 0; i < values.length - 1; i++) {

    // Storage for later assignment
    let hold = values[i];

    // If the line after the current one has a lower value, swap them.
    if (values[i + 1][1] < values[i][1]) {
      values[i] = values[i + 1];
      values[i + 1] = hold;

      // Since we had to do a swap, it means we are still sorting.
      // Thus, we do not need to restart.
      restart = false;
    }
  }

  if (restart) {
    doRestart();
  }
}

// This is the sorting function. Compares the value of the digit in each "place" (ones place, tens place, etc.)
// After sorting based on one "place" (radix) it will move on to the next radix.
function radixSort() {
  // We will use this as a flag. See below.
  nextRadix = true;

  // We loop through each value and compare them based
  // on current radix. 
  for (let i = 0; i < values.length - 1; i++) {
    // These two variables will grab the value of the digit in the current "place"
    // E.g. if radix = 0, we are grabbing the ones place. If radix = 1, we are getting the 10s place.
    let val1 = Math.floor((values[i][1] / 10 ** radix) % 10);
    let val2 = Math.floor((values[i + 1][1] / 10 ** radix) % 10);

    // This is just a store.
    let hold = values[i];

    // If the value in the current "place" is greater than in the next line, swap the two lines so the lower
    // value comes first.
    if (val1 > val2) {
      values[i] = values[i + 1];
      values[i + 1] = hold;

      // Since we did a swap, it means we are still using this radix to sort with.
      nextRadix = false;
    }
  }

  // If we didn't swap in the for loop,
  // we are done sorting with this radix.
  if (nextRadix) {
    radix += 1;
  }

  // None of our values have more than 4 digits, so if
  // the radix is greater than 4, we restart.
  if (radix > 4) {
    doRestart();
  }
}

// This is the restart function
function doRestart() {
  // This will clear the values array
  values.length = 0;

  // Re-do our initialization.
  doInit();

  // Set out flags to before we ran the sorting loop.
  first = true;
  count = 0;
  radix = 0;
}
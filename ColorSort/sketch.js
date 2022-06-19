const values = [];
let i = 0;
let j = 0;
let lines = 1000;
let store = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  init();
}

let first = true;
let count = 0;
function draw() {
  drawBackground();

  drawCircle(lines);

  if (first) {
    let val = random(store);
    values[count] = val;
    store.splice(store.indexOf(val), 1);

    count += 1;

    if (count === values.length) {
      first = false;
    }
  } else {
    sortCircle();
  }
}

function drawBackground() {
  fill(0);
  noStroke();
  rect(0, 0, width, height);
}

function drawCircle(lines) {
  let count = 0;
  for (let i = 0; i < 360; i += 360 / lines) {
    let end = getXY(i);
    let center = [width / 2, height / 2];
    stroke(
      values[count][0], 
      values[count][1],
      values[count][2]
    )
    line(center[0], center[1], end[0] + center[0], end[1] + center[1]);
    count += 1;
  }
}

function getXY(deg) {
  let rad = deg * (Math.PI / 180);

  let x = 200 * Math.cos(rad);
  let y = 200 * Math.sin(rad);

  return [x, y];
}

function init() {
  let last = [255, 0, 0];
  let delta = (255 * 3) / lines;

  let first = true;
  let second = false;
  
  for (let i = 0; i < 360; i += 360 / lines) {
    values.push([last, i]);
    if (first) {
      last = [last[0] - delta, last[1] + delta, last[2]];
      if (last[0] <= 0) {
        first = false;
        second = true;
      }
    } else if (second) {
      last = [last[0], last[1] - delta, last[2] + delta];
      if (last[1] <= 0) {
        second = false;
      }
    } else {
      last = [last[0] + delta, last[1] - delta, last[2] - delta];
    }
  }

  store = [...values];
}

function sortCircle() {
  for (let i = 0; i < values.length - 1; i++) {
    let hold = values[i];

    if (values[i + 1][1] > values[i][1]) {
      values[i] = values[i + 1];
      values[i + 1] = hold;
    }
  }
}
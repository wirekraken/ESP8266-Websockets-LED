import UI from './ui.js';
import { ws } from './ws.js';


const range = UI.content.main.rangeBlock;

updateRange(range.brightness.input, range.brightness.output, 25);
updateRange(range.duration.input, range.duration.output, 10, true);

let lastSendTime = 0;

range.brightness.input.oninput = function() {
  updateRange(range.brightness.input, range.brightness.output, this.value);

  const now = Date.now();
  if (lastSendTime > now - 50) return; // send data no more than 50ms
  lastSendTime = now;

  const prepData = 'B' + this.value;
  console.log(prepData);
  ws.send(prepData);
};

range.brightness.input.onchange = function() { // fixes if move the range quickly
  const prepData = 'B' + this.value;
  console.log(prepData);
  ws.send(prepData);
};

// only for the interface range
range.duration.input.oninput = function() {
  updateRange(range.duration.input, range.duration.output, this.value, true);
};

range.duration.input.onchange = function() {
  const prepData = 'D' + this.value;
  console.log(prepData);
  ws.send(prepData);
};


export function updateRange(input, output, value, isDuration=false) {
  const min = input.min;
  const max = input.max;

  input.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%';
  input.value = value;

  output.value = isDuration ? value + 's' : value;
};

import UI from './ui.js';
import { ws } from './ws.js';

const colorPicker = new KellyColorPicker({ place: UI.header.canvasColorPicker });

colorPicker.getWheel().width += 14; // ring width 
colorPicker.getSvFigCursor().radius += 10; // width of the small ring
colorPicker.getWheelCursor().height += 5; // slider size
colorPicker.resize(260); // total ring size

let isActive = false;

// set colorpicker position
(() => {
  const offsetTop = UI.content.main.currentEffectELem.offsetTop;
  const height = UI.header.colorPickerBlock.clientHeight;
  UI.header.colorPickerBlock.style.top = `${offsetTop - (height / 3)}px`;
  UI.header.colorPickerBlock.style.display = 'none';
})();


try {
  document.createEvent('touchevent'); // check the touch screen

  UI.header.canvasColorPicker.addEventListener('touchstart', clickDown);
  UI.header.canvasColorPicker.addEventListener('touchend', clickUp);
  UI.header.canvasColorPicker.addEventListener('touchmove', clickMove);
}
catch (e) {
  UI.header.canvasColorPicker.addEventListener('mousedown', clickDown);
  UI.header.canvasColorPicker.addEventListener('mouseup', clickUp);
  UI.header.canvasColorPicker.addEventListener('mousemove', clickMove);
}

const setColorPickerBoxShadow = (currentColor) => {
  const boxShadow = `0px 0px 10px 10px ${currentColor} inset, 0 0 10px ${currentColor}`;
  UI.header.canvasColorPicker.style.boxShadow = boxShadow;  
}

function clickDown() {
  isActive = true;
  UI.panel.btnBlock.togglePlay.checked = false;
}

function clickUp() {
  isActive = false;
  const payload = colorPicker.getCurColorHex();
  setColorPickerBoxShadow(payload);

  console.log(payload);
  ws.send(payload);
}

let lastSendTime = 0;

function clickMove() {
  if (!isActive) return;
  const payload = colorPicker.getCurColorHex();
  setColorPickerBoxShadow(payload);
  const now = Date.now();

  if (lastSendTime > now - 100) return; // send data no more than 100ms
  lastSendTime = now;

  console.log(payload);
  ws.send(payload);
}

export { colorPicker };
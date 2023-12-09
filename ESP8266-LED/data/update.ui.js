import UI from './ui.js';
import { colorPicker } from './colorpicker.js';
import { updateRange } from './range.handlers.js';


const onMessage = (message) => {
  console.log('Received:', message.data);

  const payload = message.data.substring(1);
  const service = message.data[0];

  const range = UI.content.main.rangeBlock;
  
  switch(service) {
    case 'E':
      UI.panel.btnBlock.togglePlay.checked = true;
      localStorage.currentEffect = +(payload);
      updateList(localStorage.themeColor); // handled by the server
    break;
    case 'B':
      updateRange(range.brightness.input, range.brightness.output, payload);
      break;
    case 'D':
      updateRange(range.duration.input, range.duration.output, payload, true);
    break;
    case 'P':
      if (payload === '1') {
        UI.panel.btnBlock.togglePlay.checked = true;
        return;
      }
      UI.panel.btnBlock.togglePlay.checked = false;
    break;
    case 'L':
      if (payload === '1') {
        UI.panel.btnBlock.togglePlay.checked = true;
        UI.panel.btnBlock.toggleLoop.checked = true;
        UI.panel.btnBlock.toggleRandom.checked = false;
        return;
      }
      UI.panel.btnBlock.toggleLoop.checked = false;
    break;
    case 'R':
      if (payload === '1') {
        UI.panel.btnBlock.togglePlay.checked = true;
        UI.panel.btnBlock.toggleRandom.checked = true;
        UI.panel.btnBlock.toggleLoop.checked = false;
        return;
      }
      UI.panel.btnBlock.toggleRandom.checked = false;
    break;
    case '#':
      colorPicker.setColorByHex(payload);
      UI.header.canvasColorPicker.style.boxShadow = `0px 0px 10px 10px ${payload} inset, 0 0 10px ${payload}`;
    break;
  }

}

const updateList = (color='rgba(120,120,120,.5') => {
  UI.content.main.currentEffectELem.innerText = UI.content.effectElems[+localStorage.currentEffect - 1].innerText;
  UI.content.effectElems.forEach(elem => elem.style.background = '');
  // if (+(UI.content.effectElems[+localStorage.currentEffect - 1].dataset.effect) > 17) {
  //  background = '#cd5300';
  // }
  UI.content.main.currentEffectELem.style.background = color;
  UI.content.effectElems[+localStorage.currentEffect - 1].style.background = color;
};

export { updateList, onMessage };
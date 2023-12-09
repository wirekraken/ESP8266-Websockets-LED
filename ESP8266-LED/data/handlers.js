import UI from './ui.js';
import { ws } from './ws.js';
import { updateList } from './update.ui.js';
import './nav.handlers.js'
import './range.handlers.js'

// set list position
(() => {
  const documentHeight = document.documentElement.clientHeight;
  const panelHeight = UI.panel.block.clientHeight;
  const headerHeight = UI.header.block.clientHeight;

  UI.content.effectsList.style.height = `${documentHeight - (panelHeight + headerHeight)}px`;
})();


export const initEffects = () => {
  localStorage.currentEffect = 1;

  for (const elem of UI.content.effectElems) {
    elem.onclick = function() {
      localStorage.currentEffect = this.dataset.effect;
      UI.panel.btnBlock.togglePlay.checked = true;
      updateList(); // not handled by the server yet

      const prepData = 'E' + this.dataset.effect;
      console.log(prepData);
      ws.send(prepData);
    };
  }
};
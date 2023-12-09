import UI from './ui.js';
import { wsConnect } from './ws.js';
import { initEffects } from './handlers.js';
import { initSnow } from './snow.js'

import './colorpicker.js';
import './settings.js';


window.onload = () => {
  document.querySelector('.preloader')
    .classList.add('preloader-remove');
  wsConnect();
  initEffects();
  const snowflakesCount = 30;
  initSnow(snowflakesCount);

  UI.header.toggleColorPicker.onclick = function() {
    if (this.checked) {
      UI.header.toggleContent.checked = false;

      UI.content.main.currentEffectELem.style.display = 'none';
      UI.content.effectsList.style.display = 'none';
      UI.content.main.block.style.display = 'flex';

      UI.header.colorPickerBlock.style.display = 'flex';
      return;
    }

    if (UI.header.toggleContent.checked) {
      UI.header.toggleContent.checked = true;
      UI.content.effectsList.style.display = 'flex';
    }

    UI.content.main.currentEffectELem.style.display = 'flex';
    UI.header.colorPickerBlock.style.display = 'none';
  };

  UI.header.toggleContent.onclick = function() {
    if (this.checked) {
      UI.content.effectsList.style.display = 'flex';
      UI.content.main.block.style.display = 'none';

      UI.header.toggleColorPicker.checked = false;
      UI.header.colorPickerBlock.style.display = 'none';
      return;
    }
    
    UI.content.main.block.style.display = 'flex';
    UI.content.effectsList.style.display = 'none';
    UI.content.main.currentEffectELem.style.display = 'flex';
  };

  UI.header.toggleSettings.onclick = function() {
    if (this.checked) {
      UI.header.settingsBlock.style.display = 'flex';
      return;
    }
    UI.header.settingsBlock.style.display = 'none';
  };

};




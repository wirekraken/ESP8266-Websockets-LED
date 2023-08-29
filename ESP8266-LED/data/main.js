import { UI } from './init.js';
import { wsConnect } from './socket.js';
import { initEffects } from './effect-handlers.js';

import './colorpicker.js';
import './settings.js';
import './snow.js';


window.onload = () => {
	document.querySelector('.preloader').classList.add('preloader-remove');
	wsConnect();
	initEffects();
};


UI.header.toggleColorPicker.onclick = function() {
	const contentState = UI.header.toggleContent.checked;

	if (this.checked) {
		UI.header.toggleContent.checked = false;

		UI.content.main.currentEffectELem.style.display = 'none';
		UI.content.effectsList.style.display = 'none';
		UI.content.main.block.style.display = 'flex';

		UI.header.colorPickerBlock.style.display = 'flex';
		return;
	}

	if (contentState) {
		UI.header.toggleContent.checked = contentState;
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


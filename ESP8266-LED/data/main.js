import { UI } from './init.js';
import { wsConnect } from './socket.js';
import { initEffects } from './effect-handlers.js';

import './colorpicker.js';
import './themes.js';
import './snow.js';


const dev = 0;

if (dev) localStorage.clear();

window.onload = () => {
	console.log('All content loaded');
	wsConnect();
	initEffects();
};



UI.header.toggleColorPicker.onclick = function() {
	const state = UI.header.toggleContent.checked;

	if (this.checked) {
		UI.content.main.currentEffectELem.style.display = 'none';
		UI.header.toggleContent.checked = false;
		UI.content.effectsList.style.display = 'none';
		UI.content.main.block.style.display = 'flex';

		UI.header.colorPickerBlock.style.display = 'flex';
		UI.header.colorPickerBlock.hidden = false;
		return;
	}

	UI.content.main.currentEffectELem.style.display = 'flex';
	if (state) {
		UI.header.toggleContent.checked = state;
		UI.content.effectsList.style.display = 'flex';
	}
	UI.header.colorPickerBlock.style.display = 'none';
	UI.header.colorPickerBlock.hidden = true;
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

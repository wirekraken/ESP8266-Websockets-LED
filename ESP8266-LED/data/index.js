const app = document.getElementById('app');

const header = document.querySelector('.header');
const panel = document.querySelector('.panel');
const colorPickerBlock = document.querySelector('.colorpicker_block');
const settingsBlock = document.querySelector('.settings_block');

const contentMain = document.querySelector('.content .content_main');

const canvasColorPicker = document.getElementById('colorpicker');
const colorPicker = new KellyColorPicker({place: canvasColorPicker});

const toggleColorPicker = document.querySelector('.toggle_colorpicker');
const toggleSettings = document.querySelector('.toggle_settings');
const toggleContent = document.querySelector('.toggle_content');

window.onload = () => {
	// onImagesLoaded(app, () => {
		console.log('All content loaded');
		initWebSocket();
		sendEffect();
	// });
};

toggleColorPicker.onclick = function() {
	let state = toggleContent.checked;
	if (this.checked) {
		currentEffectELem.style.display = 'none';
		toggleContent.checked = false;
		effectsList.style.display = 'none';
		contentMain.style.display = 'flex';

		colorPickerBlock.style.display = 'flex';
	}
	else {
		currentEffectELem.style.display = 'flex';
		if (state) {
			toggleContent.checked = state;
			effectsList.style.display = 'flex';
		}
		colorPickerBlock.style.display = 'none';
	}
};

toggleContent.onclick = function() {
	if (this.checked) {
		effectsList.style.display = 'flex';
		contentMain.style.display = 'none';

		toggleColorPicker.checked = false;
		colorPickerBlock.style.display = 'none';
	}
	else {
		contentMain.style.display = 'flex';
		effectsList.style.display = 'none';
		currentEffectELem.style.display = 'flex';
	}
};

toggleSettings.onclick = function() {
	if (this.checked) {
		settingsBlock.style.display = 'flex';
	}
	else {
		settingsBlock.style.display = 'none';
	}
};


// function onImagesLoaded(container, event) {
// 	const images = container.getElementsByTagName('img');
// 	let loaded = images.length;
// 	for (let image of images) {
// 		if (image.complete) {
// 			loaded--;
// 		}
// 		else {
// 			image.addEventListener('load', function() {
// 				loaded--;
// 				if (loaded === 0) {
// 					event();
// 				}
// 			});
// 		}
// 		if (loaded == 0) {
// 			event();
// 		}
// 	}
// }
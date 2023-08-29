import { UI } from './init.js';
import { ws } from './ws.js';

const colorPicker = new KellyColorPicker({place: UI.header.canvasColorPicker});

colorPicker.getWheel().width += 14; // ring width 
colorPicker.getSvFigCursor().radius += 10; // width of the small ring
colorPicker.getWheelCursor().height += 5; // slider size
colorPicker.resize(260); // total ring size

let isActive = false;

// positioning
UI.header.colorPickerBlock.style.top = UI.content.main.currentEffectELem.offsetTop - (UI.header.colorPickerBlock.clientHeight / 3) + 'px';
UI.header.colorPickerBlock.style.display = 'none';

// ------------------- fix me -----------------------
// intervention error
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

function clickDown() {
	isActive = true;
	UI.panel.btnBlock.togglePlay.checked = false;
}

function clickUp() {
	isActive = false;
	UI.header.canvasColorPicker.style.boxShadow = `0px 0px 10px 10px ${colorPicker.getCurColorHex()} inset, 0 0 10px ${colorPicker.getCurColorHex()}`;

	const payload = colorPicker.getCurColorHex();

	console.log(payload);
	ws.send(payload);
}

let lastSend = 0;

function clickMove() {
	if (isActive) {  
		UI.header.canvasColorPicker.style.boxShadow = `0px 0px 10px 10px ${colorPicker.getCurColorHex()} inset, 0 0 10px ${colorPicker.getCurColorHex()}`;

		const payload = colorPicker.getCurColorHex();
		const now = (new Date).getTime();

		if (lastSend > now - 100) return; // send data no more than 100ms

		lastSend = now;

		console.log(payload);
		ws.send(payload);
	}
	
}
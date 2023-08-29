import { UI, updateList } from './init.js';
import { ws } from './ws.js';


UI.content.effectsList.style.height = document.documentElement.clientHeight - (UI.panel.block.clientHeight + UI.header.block.clientHeight) + 'px';

const COUNT = UI.content.effectsList.children.length; // effects count
localStorage.currentEffect = 1;


if (ws) ws.onmessage = onMessage;

function onMessage(payload) {
	messageHandler(payload.data);
	console.log('Received: ', payload.data);
}

function messageHandler(payload) {
	let getData = payload.substring(1);
	
	switch(payload[0]) {
		case 'E':
			UI.panel.btnBlock.togglePlay.checked = true;
			localStorage.currentEffect = +(getData);
			updateList(localStorage.theme); // handled by the server
		break;
		case 'B':
			updateRange(UI.content.main.rangeBlock.rangeBrightness, UI.content.main.rangeBlock.brightnessValue, getData);
		break;
		case 'D':
			updateRange(UI.content.main.rangeBlock.rangeDuration, UI.content.main.rangeBlock.durationValue, getData, true);
		break;
		case 'P':
			if (getData === '1') {
				UI.panel.btnBlock.togglePlay.checked = true;
			}
			else {
				UI.panel.btnBlock.togglePlay.checked = false;
			}
		break;
		case 'L':
			if (getData === '1') {
				UI.panel.btnBlock.togglePlay.checked = true;
				UI.panel.btnBlock.toggleLoop.checked = true;
				UI.panel.btnBlock.toggleRandom.checked = false;
			}
			else {
				UI.panel.btnBlock.toggleLoop.checked = false;
			}
		break;
		case 'R':
			if (getData === '1') {
				UI.panel.btnBlock.togglePlay.checked = true;
				UI.panel.btnBlock.toggleRandom.checked = true;
				UI.panel.btnBlock.toggleLoop.checked = false;
			}
			else {
				UI.panel.btnBlock.toggleRandom.checked = false;
			}
		break;
		case '#':
			colorPicker.setColorByHex(payload);
			canvasColorPicker.style.boxShadow = `0px 0px 10px 10px ${colorPicker.getCurColorHex()} inset, 0 0 10px ${colorPicker.getCurColorHex()}`;
		break;
	}

}


(function rangeHandler() {

	updateRange(UI.content.main.rangeBlock.rangeBrightness, UI.content.main.rangeBlock.brightnessValue, 25);
	updateRange(UI.content.main.rangeBlock.rangeDuration, UI.content.main.rangeBlock.durationValue, 10, true);

	let lastSend = 0;

	UI.content.main.rangeBlock.rangeBrightness.oninput = function() {

		updateRange(UI.content.main.rangeBlock.rangeBrightness, UI.content.main.rangeBlock.brightnessValue, this.value);
		
		let payload = 'B' + this.value;

		const now = (new Date).getTime();
		if (lastSend > now - 50) return; // send data no more than 50ms
		lastSend = now;

		console.log(payload);
		ws.send(payload);
	};

	UI.content.main.rangeBlock.rangeBrightness.onchange = function() { // fixes if move the range quickly
		const payload = 'B' + this.value;
		console.log(payload);
		ws.send(payload);
	}

	// only for the interface range
	UI.content.main.rangeBlock.rangeDuration.oninput = function() {
		updateRange(UI.content.main.rangeBlock.rangeDuration, UI.content.main.rangeBlock.durationValue, this.value, true);

	};
	UI.content.main.rangeBlock.rangeDuration.onchange = function() {
		const payload = 'D' + this.value;

		console.log(payload);
		ws.send(payload);
	}

})();

function updateRange(range, output, value, isDuration=false) {
	const min = range.min;
	const max = range.max;

	range.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%';
	range.value = value;

	output.value = isDuration ? value + 's' : value;

};



UI.panel.btnBlock.togglePlay.onclick = function() {
	const payload = (this.checked) ? 'P1' : 'P0';

	console.log(payload);
	ws.send(payload);
}

UI.panel.btnBlock.toggleLoop.onclick = function() {
	let payload;
	if (this.checked) {
		UI.panel.btnBlock.togglePlay.checked = true;
		UI.panel.btnBlock.toggleRandom.checked = false;
		payload = 'L1';
	}
	else {
		payload = 'L0';
	}

	console.log(payload);
	ws.send(payload);

}

UI.panel.btnBlock.toggleRandom.onclick = function() {
	let payload;
	if (this.checked) {
		UI.panel.btnBlock.togglePlay.checked = true;
		UI.panel.btnBlock.toggleLoop.checked = false;
		payload = 'R1';
	}
	else {
		payload = 'R0';
	}
	
	console.log(payload);
	ws.send(payload);

}

UI.panel.btnBlock.prevButton.onclick = function() {

	UI.panel.btnBlock.togglePlay.checked = true;

	if (+localStorage.currentEffect === 1) {
		localStorage.currentEffect = COUNT;
		console.log('one')
	}
	else {
		--localStorage.currentEffect;
	}

	updateList('rgba(120,120,120,.8');

	const payload = 'E' + localStorage.currentEffect;

	console.log(payload);
	ws.send(payload);
}

UI.panel.btnBlock.nextButton.onclick = function() {

	if (!UI.panel.btnBlock.togglePlay.checked) {
		localStorage.currentEffect = 0;
	}

	UI.panel.btnBlock.togglePlay.checked = true;
	
	if (+localStorage.currentEffect === COUNT) {
		localStorage.currentEffect = 1;
	}
	else {
		++localStorage.currentEffect;
	}

	updateList('rgba(120,120,120,.8');

	const payload = 'E' + localStorage.currentEffect;

	console.log(payload);
	ws.send(payload);
}


function initEffects() {
	for (const item of UI.content.effectElems) {
		item.onclick = function() {

			localStorage.currentEffect = this.dataset.effect;
			UI.panel.btnBlock.togglePlay.checked = true;
	
			// updateList(localStorage.theme);
			updateList('rgba(120,120,120,.8'); // not handled by the server yet

			const payload = 'E' + this.dataset.effect;

			console.log(payload);
			// console.log("Current: ", localStorage.currentEffect)
			ws.send(payload);

		};
	}
}

export { initEffects };
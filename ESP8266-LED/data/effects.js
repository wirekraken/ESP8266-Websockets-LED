// const webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');


const app = document.getElementById('#app');

const header = document.querySelector('.header');
const settingsBlock = document.querySelector('.settings_block');

const contentMain = document.querySelector('.content .content_main');
const effectsList = document.querySelector('.content .effects_list');
const effectElems = document.querySelectorAll('.effects_list span');

const ledCont = document.querySelector('.led_controls');
const togglePlay = document.querySelector('.toggle_play');

const rangeBrightness = document.querySelector('.range_brightness');
const brightnessValue = document.querySelector('.brightness_value');



effectsList.style.height = document.documentElement.clientHeight - (ledCont.clientHeight + header.clientHeight) + 'px';

console.log(ledCont.offsetHeight)

window.onload = function() {
	initWebSocket();
	alert("LOADED")
};

(screen.width > 600) ? handlerPC() : handlerMobile();

function handlerPC() {
	// sendEffect();
	
}

function handlerMobile() {
	sendEffect();

}

const LED_COUNT = 29;
let currentEffect = 1;

let webSocket;

function initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');
    webSocket.onopen = onOpen;
    webSocket.onclose = onClose;
    webSocket.onerror = onError;
    webSocket.onmessage = onMessage;
}


function onMessage(payload) {

	if (payload.data[0] === 'E') {
		currentEffect = (+payload.data.replace(/\D/g, ""));

		updateList('olive');

	}
	else if (payload.data[0] === 'B') {
		// brightnessValue.value = parseInt((+payload.data.replace(/\D/g, ""))/2555);
		// rangeBrightness.style.backgroundSize = (rangeBrightness.value - 0) * 100 / (100 - 0) + '% 100%';
		// rangeBrightness.value = parseInt((+payload.data.replace(/\D/g, ""))/2555);
		console.log('get B :', payload.data)
	}

	console.log('got: ', payload.data);
	// console.log(+payload.data.replace(/\D/g, ""));
}

function onClose(e) {
    console.log('Connection closed ', e);
    setTimeout(initWebSocket, 1000);
}

function onError(e) {
	console.log(`[error] ${ e }`);
}

function onOpen() {
	console.log('Connection is success');

}


function sendEffect() {
	
	for (let item of effectElems) {

		item.onclick = function() {

			currentEffect = this.dataset.effect;
			togglePlay.checked = true;
	
			updateList(localStorage.getItem('theme'));

			const payload = 'E_' + this.dataset.effect;

			console.log(payload);
			console.log("Current: ", currentEffect)
			webSocket.send(payload);

		};
	}
}

function updateList(color) {
	const currentEffectELem = document.querySelector('.content_main .current_effect');
	currentEffectELem.innerText = effectElems[currentEffect - 1].innerText;

	let background = color;
		
	Array.from(effectElems, item => {
		item.style.background = '';
		// item.classList.remove('pulse');
	}); // clear

	// if (+(effectElems[currentEffect - 1].dataset.effect) > 17) {
	// 	background = '#cd5300';
	// }

	effectElems[currentEffect - 1].style.background = background;

	// effectElems[currentEffect - 1].classList.add('pulse');
}







// ######################### range #################################

// (() => {

	// const rangeInputs = document.querySelectorAll('input[type="range"]')
	// const rangeBrightness = document.querySelector('.range_brightness');
	const rangeDuration = document.querySelector('.range_duration');
	// const brightnessValue = document.querySelector('.brightness_value');
	const durationValue = document.querySelector('.duration_value');

	// rangeBrightness.oninput = handleRangeChange.apply(rangeBrightness);
	updateRange(rangeBrightness, brightnessValue);
	updateRange(rangeDuration, durationValue);

	// brightnessValue.value = rangeBrightness.value;
	// durationValue.value = rangeDuration.value;

	let lastSend = 0;

	rangeBrightness.oninput = function() {
		const min = this.min;
		const max = this.max;
		const val = this.value;

		this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
		brightnessValue.value = this.value;
		
		let payload = 'B_' + parseInt(val * 2.555);

		const now = (new Date).getTime();
		if (lastSend > now - 50) return; // send data no more than 50ms
		lastSend = now;

		console.log(payload);
		webSocket.send(payload);
	};
	rangeBrightness.onchange = function() { // fixes if move the range quickly
		const payload = 'B_' + parseInt(this.value * 2.555);
		console.log(payload);
		webSocket.send(payload);
	}

	rangeDuration.oninput = function() {
		const min = this.min;
		const max = this.max;
		const val = this.value;

		this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

		durationValue.value = this.value;
	};

	function updateRange(range, valueElem) {
		const min = range.min;
		const max = range.max;
		const val = range.value;
		range.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
		valueElem.value = range.value;
	};



	// function handleRangeChange(e) {
	// 	// let target = e.target;

	// 	// if (e.target.type !== 'range') {
	// 	// 	target = document.querySelector('.range_brightness');
	// 	// } 

	// 	const min = this.min;
	// 	const max = this.max;
	// 	const val = this.value;

	// 	this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

	// 	brightnessValue.value = this.value;
	// }



	// rangeInputs.forEach(input => {
	//   input.addEventListener('input', handleRangeChange)
	// })
// })();


const toggleSettings = document.querySelector('.toggle_settings');
const toggleContent = document.querySelector('.toggle_content');

toggleSettings.onclick = function() {
	if (this.checked) {
		settingsBlock.style.display = 'flex';
	}
	else {
		settingsBlock.style.display = 'none';
	}
};

toggleContent.onclick = function() {
	if (this.checked) {
		effectsList.style.display = 'flex';
		contentMain.style.display = 'none';
	}
	else {
		contentMain.style.display = 'flex';
		effectsList.style.display = 'none';
	}
};
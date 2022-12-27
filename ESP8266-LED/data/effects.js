// const webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');


const app = document.getElementById('#app');

const header = document.querySelector('.header');
const settingsBlock = document.querySelector('.settings_block');

const contentMain = document.querySelector('.content .content_main');
const effectsList = document.querySelector('.content .effects_list');
const effectElems = document.querySelectorAll('.effects_list span');

const ledCont = document.querySelector('.led_controls');
const togglePlay = document.querySelector('.toggle_play');



effectsList.style.height = document.documentElement.clientHeight - (ledCont.clientHeight + header.clientHeight) + 'px';

console.log(ledCont.offsetHeight)

window.onload = function() {
	initWebSocket();
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
		// const elems = document.querySelectorAll('.effects_list span');

		currentEffect = (+payload.data.replace(/\D/g, ""));

		updateList('gold')

		// Array.from(elems, item => item.style.background = '');
	    // elems[currentEffect - 1].style.background = 'SpringGreen';


	}

	console.log('got: ', payload.data);
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
	
			updateList('#6a9300');

			let send = 'E_' + this.dataset.effect;

			console.log(send);
			console.log("Current: ", currentEffect)
			webSocket.send(send);

		};
	}
}

function updateList(color) {
	const currentEffectELem = document.querySelector('.content_main .current_effect');
	currentEffectELem.innerText = effectElems[currentEffect - 1].innerText;

	let background = color;
		
	Array.from(effectElems, item => item.style.background = ''); // clear

	// if (+(effectElems[currentEffect - 1].dataset.effect) > 17) {
	// 	background = '#cd5300';
	// }

	effectElems[currentEffect - 1].style.background = background;
}



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



// ######################### range #################################

(() => {

	// const rangeInputs = document.querySelectorAll('input[type="range"]')
	const rangeBrightness = document.querySelector('.range_brightness');
	const rangeDuration = document.querySelector('.range_duration');
	const brightnessValue = document.querySelector('.brightness_value');
	const durationValue = document.querySelector('.duration_value');

	// rangeBrightness.oninput = handleRangeChange.apply(rangeBrightness);
	updateRange(rangeBrightness, brightnessValue);
	updateRange(rangeDuration, durationValue);

	// brightnessValue.value = rangeBrightness.value;
	// durationValue.value = rangeDuration.value;

	rangeBrightness.oninput = function() {
		const min = this.min;
		const max = this.max;
		const val = this.value;

		this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

		brightnessValue.value = this.value;
	};

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
})();
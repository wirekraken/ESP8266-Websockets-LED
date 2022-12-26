// const webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');

(screen.width > 600) ? handlerPC() : handlerMobile();

const app = document.querySelector('#app');

const contentMain = document.querySelector('.content .content_main');
const effectsList = document.querySelector('.content .effects_list');

const ledCont = document.querySelector('.led_controls');
const header = document.querySelector('.header');


effectsList.style.height = document.documentElement.clientHeight - (ledCont.clientHeight + header.clientHeight) + 'px';

console.log(ledCont.offsetHeight)

function handlerPC() {
	// sendEffect();
	
}

function handlerMobile() {
	// sendEffect();

}

function sendEffect() {
	const effectElems = document.querySelectorAll('#submenu span');

	for (let item of effectElems) {

		item.onclick = function() {

			const effectNum = 'E_' + this.getAttribute('name');
			let background = '#6a9300';
			
			Array.from(effectElems, item => item.style.background = '')

			if (+(this.getAttribute('name')) > 17) background = '#cd5300';

			this.style.background = background;
			currentEffect.innerText = this.innerText;

		    console.log(effectNum);
		    webSocket.send(effectNum);

		}
	}
}



const toggleSettings = document.querySelector('.toggle_settings');
const settingsBlock = document.querySelector('.settings_block');


toggleSettings.onclick = function() {
	if (this.checked) {
		settingsBlock.style.display = 'flex';
	}
	else {
		settingsBlock.style.display = 'none';
	}
}


const toggleContent = document.querySelector('.toggle_content');

toggleContent.onclick = function() {
	if (this.checked) {
		effectsList.style.display = 'flex';
		contentMain.style.display = 'none'
	}
	else {
		contentMain.style.display = 'flex'
		effectsList.style.display = 'none';
	}
}


// ######################### range #################################


// const rangeInputs = document.querySelectorAll('input[type="range"]')
const rangeBrightness = document.querySelector('.range_brightness');
const brightnessValue = document.querySelector('.brightness_value');

const rangeDuration = document.querySelector('.range_duration');
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
}

rangeDuration.oninput = function() {
	const min = this.min;
	const max = this.max;
	const val = this.value;

	this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';

	durationValue.value = this.value;
}

function updateRange(range, valueElem) {
	const min = range.min;
	const max = range.max;
	const val = range.value;
	range.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
	valueElem.value = range.value;
}



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
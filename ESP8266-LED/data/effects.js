// const webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');

(screen.width > 600) ? handlerPC() : handlerMobile();

const cont = document.querySelector('.content .effects_list')
const ledCont = document.querySelector('.led_controls')
const header = document.querySelector('.header')

cont.style.height = document.documentElement.clientHeight - (ledCont.clientHeight + header.clientHeight) + 'px';

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
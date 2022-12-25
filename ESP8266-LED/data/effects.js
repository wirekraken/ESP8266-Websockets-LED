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



const bgSetter = document.querySelector('.bg_setter_block .bg_setter')

// bgSetter.onclick = function() {
// 	const bgInput = document.querySelector('.bg_setter_block input')
// 	console.log(bgInput.value)
// 	app.style.backgroundImage = `url(${ bgInput.value })`;

// 	localStorage.setItem('bg', bgInput.value)
	
// }

bgSetter.onclick = setBg;

setBg();

function setBg() {
	const bgInput = document.querySelector('.bg_setter_block input')
	let bg = null;

	if (bgInput.value) {
		localStorage.setItem('bg', bgInput.value);
		console.log('set bg')
		bg = bgInput.value;
	}
	else {
		if (localStorage.getItem('bg')) {
			// console.log(localStorage.getItem('bg'))
			bg = localStorage.getItem('bg');
			console.log('get bg')
		}
		bgInput.value = bg;
	}

	
	console.log(bgInput.value)
	app.style.backgroundImage = `url(${ bg })`;
}

// ###############################################################

const themeSetters = document.querySelectorAll('.theme_setter_block .theme_setter');

const navBgSetter = document.querySelector('.toggle_nav_bg')

let checkedTheme = null;

navBgSetter.onclick = function() {
	if (this.checked) {
		ledCont.style.background = checkedTheme;
		localStorage.setItem('is_nav_color', true);
	}
	else {
		ledCont.style.background = '';
		localStorage.setItem('is_nav_color', '');
	}
}


if (localStorage.getItem('theme')) {
	document.querySelector('.theme_' + localStorage.getItem('theme')).checked = true;
}

if (localStorage.getItem('is_nav_color')) {
	document.querySelector('.toggle_nav_bg').checked = true;
}


for (let item of themeSetters) {

	if (item.checked) {

		checkedTheme = item.dataset.themeColor;
		if (localStorage.getItem('theme')) {
			item.dataset.themeColor = localStorage.getItem('theme');
		}

		changeThemeColor(item.dataset.themeColor);
		if (navBgSetter.checked) {
			localStorage.setItem('is_nav_color', true);
			ledCont.style.background = item.dataset.themeColor;
		}
		else {
			localStorage.setItem('is_nav_color', '');
		}
			
	}

	item.onclick = function() {
		changeThemeColor(this.dataset.themeColor);
		checkedTheme = this.dataset.themeColor;
		localStorage.setItem('theme', item.dataset.themeColor);

		if (navBgSetter.checked) {
			localStorage.setItem('is_nav_color', true);
			ledCont.style.background = item.dataset.themeColor;
		}
		else {
			localStorage.setItem('is_nav_color', '');
		}
			
	}
}

// goldTheme.addEventListener('click', () => changeThemeColor('gold'));

// changeThemeColor('darkblue')

function changeThemeColor(color) {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor.setAttribute("content", color);
    // setTimeout(function() {
    //     changeThemeColor(color);
    // }, 1000);
}
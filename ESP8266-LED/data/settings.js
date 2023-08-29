import { UI, updateList } from './init.js';

const backgroundImage = 'background/bg.jpg';
const backgroundRadial = 'radial-gradient(rgba(20, 26, 73, 0.6), rgb(0, 0, 0))';


if (UI.settings.toggleBg.checked) {
	UI.content.block.style.backgroundImage = `url(${ backgroundImage })`;
	localStorage.bg = true;
}

if (localStorage.bg) {
	UI.settings.toggleBg.checked = true;
	UI.content.block.style.backgroundImage = `url(${ backgroundImage })`;
}
else {
	UI.settings.toggleBg.checked = false;
	UI.content.block.style.backgroundImage = backgroundRadial;
}

UI.settings.toggleBg.onclick = function() {
	if (this.checked) {
		UI.content.block.style.backgroundImage = `url(${ backgroundImage })`;
		localStorage.bg = true;
		return;
	}
	UI.content.block.style.backgroundImage = backgroundRadial;
	localStorage.bg = '';
};


let checkedTheme;

UI.settings.togglePanelFill.onclick = function() {
	if (this.checked) {
		UI.panel.block.style.background = checkedTheme;
		return;
	}
	UI.panel.block.style.background = '';
};

if (localStorage.theme) {
	document.querySelector('.theme_' + localStorage.theme).checked = true;
	console.log(localStorage.theme)
}


for (const themeSetter of UI.settings.themeSetters) {
	if (themeSetter.checked) {
		checkedTheme = themeSetter.dataset.themeColor;

		if (UI.settings.togglePanelFill.checked) {
			UI.panel.block.style.background = checkedTheme;
		}

		if (localStorage.theme) {
			themeSetter.dataset.themeColor = localStorage.theme;
		}
		else {
			localStorage.theme = checkedTheme;
		}

		changeThemeColor(themeSetter.dataset.themeColor);

		if (UI.settings.togglePanelFill.checked) {
			UI.panel.block.style.background = themeSetter.dataset.themeColor;
		}

		
		app.style.background = themeSetter.dataset.themeColor;

		UI.content.main.currentEffectELem.style.background = themeSetter.dataset.themeColor;

		Array.from(document.querySelectorAll('.led_controls_rng .range'), elem => {
			elem.style.backgroundImage = `linear-gradient(${themeSetter.dataset.themeColor}, ${themeSetter.dataset.themeColor})`;
		});
			
	}

	themeSetter.onclick = themeSetterCallback;
}

function themeSetterCallback() {
	changeThemeColor(this.dataset.themeColor);
	checkedTheme = this.dataset.themeColor;
	localStorage.theme = this.dataset.themeColor;

	app.style.background = this.dataset.themeColor;

	UI.content.main.currentEffectELem.style.background = this.dataset.themeColor;

	Array.from(document.querySelectorAll('.led_controls_rng .range'), elem => {
		elem.style.backgroundImage = `linear-gradient(${this.dataset.themeColor}, ${this.dataset.themeColor})`;
	});

	updateList(this.dataset.themeColor);

	if (UI.settings.togglePanelFill.checked) {
		UI.panel.block.style.background = this.dataset.themeColor;
	}
}

// changeThemeColor('darkblue')

function changeThemeColor(color) {
	const metaThemeColor = document.querySelector('meta[name=theme-color]');
	metaThemeColor.setAttribute('content', color);
}

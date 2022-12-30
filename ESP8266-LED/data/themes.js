
let update = 0;

if (update) localStorage.clear();

(() => {

	const themeSetters = document.querySelectorAll('.theme_setter_block .theme_setter');

	const content = document.querySelector('.content');
	const togglePanelFill = document.querySelector('.toggle_panel_fill');
	const toggleBg = document.querySelector('.toggle_bg');

	let background = 'background/bg.jpg';

	if (toggleBg.checked) {
		content.style.backgroundImage = `url(${ background })`;
		localStorage.setItem('bg', true);
	}

	if (localStorage.getItem('bg')) {
		toggleBg.checked = true;
		content.style.backgroundImage = `url(${ background })`;
	}
	else {
		toggleBg.checked = false;
		content.style.backgroundImage = 'radial-gradient(rgba(20, 26, 73, 0.6), rgb(0, 0, 0))';
	}

	toggleBg.onclick = function() {
		if (this.checked) {
			content.style.backgroundImage = `url(${ background })`;
			localStorage.setItem('bg', true);
		}
		else {
			content.style.backgroundImage = 'radial-gradient(rgba(20, 26, 73, 0.6), rgb(0, 0, 0))';
			localStorage.setItem('bg', '');
		}
	};

	let checkedTheme = null;

	togglePanelFill.onclick = function() {
		if (this.checked) {
			panel.style.background = checkedTheme;
			// localStorage.setItem('panel_fill', true);
		}
		else {
			panel.style.background = '';
			// localStorage.setItem('panel_fill', false);
		}
	};

	if (localStorage.getItem('theme')) {
		document.querySelector('.theme_' + localStorage.getItem('theme')).checked = true;
		console.log(localStorage.getItem('theme'))
	}

	// if (localStorage.getItem('panel_fill')) {
	// 	document.querySelector('.toggle_panel_fill').checked = true;
	// }
	// else {
	// 	document.querySelector('.toggle_panel_fill').checked = false;
	// }


	for (let item of themeSetters) {

		if (item.checked) {

			checkedTheme = item.dataset.themeColor;

			if (togglePanelFill.checked) {
				panel.style.background = checkedTheme;
			}

			if (localStorage.getItem('theme')) {
				item.dataset.themeColor = localStorage.getItem('theme');
			}
			else {
				localStorage.setItem('theme', checkedTheme);
			}

			changeThemeColor(item.dataset.themeColor);

			if (togglePanelFill.checked) {
				// localStorage.setItem('panel_fill', true);
				panel.style.background = item.dataset.themeColor;
			}
			// Array.from(effectsList.children, e => e.style.color = item.dataset.themeColor )

			
			app.style.background = item.dataset.themeColor;

			currentEffectELem.style.background = item.dataset.themeColor;

			Array.from(document.querySelectorAll('.led_controls_rng .range'), range => {
				range.style.backgroundImage = `linear-gradient(${item.dataset.themeColor}, ${item.dataset.themeColor})`;
			});
				
		}

		item.onclick = function() {

			changeThemeColor(this.dataset.themeColor);
			checkedTheme = this.dataset.themeColor;
			localStorage.setItem('theme', this.dataset.themeColor);

			// Array.from(effectsList.children, e => e.style.color = item.dataset.themeColor);

			app.style.background = item.dataset.themeColor;

			currentEffectELem.style.background = this.dataset.themeColor;

			Array.from(document.querySelectorAll('.led_controls_rng .range'), e => {
				e.style.backgroundImage = `linear-gradient(${this.dataset.themeColor}, ${this.dataset.themeColor})`;
				// console.log(e.style.backgroundImage)
			});

			updateList(this.dataset.themeColor);


			if (togglePanelFill.checked) {
				// localStorage.setItem('panel_fill', true);
				panel.style.background = item.dataset.themeColor;
			}
			else {
				// localStorage.setItem('panel_fill', '');
			}
				
		};
	}


	// changeThemeColor('darkblue')

	function changeThemeColor(color) {
		const metaThemeColor = document.querySelector("meta[name=theme-color]");
		metaThemeColor.setAttribute("content", color);
		// setTimeout(function() {
		//     changeThemeColor(color);
		// }, 1000);
	}

})();
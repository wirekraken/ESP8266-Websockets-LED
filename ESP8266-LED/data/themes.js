// const bgSetter = document.querySelector('.bg_setter_block .bg_setter')

// bgSetter.onclick = function() {
// 	const bgInput = document.querySelector('.bg_setter_block input')
// 	console.log(bgInput.value)
// 	app.style.backgroundImage = `url(${ bgInput.value })`;

// 	localStorage.setItem('bg', bgInput.value)
	
// }


let update = 0;

if (update) localStorage.clear();

// bgSetter.onclick = setBg;

// setBg();

// function setBg() {
// 	const bgInput = document.querySelector('.bg_setter_block input')
// 	let bg = null;

// 	if (bgInput.value) {
// 		localStorage.setItem('bg', bgInput.value);
// 		console.log('set bg')
// 		bg = bgInput.value;
// 	}
// 	else {
// 		if (localStorage.getItem('bg')) {
// 			// console.log(localStorage.getItem('bg'))
// 			bg = localStorage.getItem('bg');
// 			console.log('get bg')
// 		}
// 		bgInput.value = bg;
// 	}

	
// 	console.log(bgInput.value)
// 	app.style.backgroundImage = `url(${ bg })`;
// }

(() => {

	const app = document.getElementById('app');

	const themeSetters = document.querySelectorAll('.theme_setter_block .theme_setter');

	const navFillSetter = document.querySelector('.toggle_fill_nav');

	let checkedTheme = null;

	navFillSetter.onclick = function() {
		if (this.checked) {
			panel.style.background = checkedTheme;
			localStorage.setItem('is_nav_color', true);
		}
		else {
			panel.style.background = '';
			localStorage.setItem('is_nav_color', '');
		}
	};


	if (localStorage.getItem('theme')) {
		document.querySelector('.theme_' + localStorage.getItem('theme')).checked = true;
		console.log(localStorage.getItem('theme'))
	}

	if (localStorage.getItem('is_nav_color')) {
		document.querySelector('.toggle_fill_nav').checked = true;
	}


	for (let item of themeSetters) {

		if (item.checked) {

			checkedTheme = item.dataset.themeColor;

			if (localStorage.getItem('theme')) {
				item.dataset.themeColor = localStorage.getItem('theme');
			}

			changeThemeColor(item.dataset.themeColor);

			if (navFillSetter.checked) {
				localStorage.setItem('is_nav_color', true);
				panel.style.background = item.dataset.themeColor;
			}
			else {
				localStorage.setItem('is_nav_color', '');
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


			if (navFillSetter.checked) {
				localStorage.setItem('is_nav_color', true);
				panel.style.background = item.dataset.themeColor;
			}
			else {
				localStorage.setItem('is_nav_color', '');
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
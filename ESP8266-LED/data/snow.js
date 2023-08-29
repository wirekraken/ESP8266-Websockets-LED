const snowflakesCount = 30;

const baseStyles = `
	#snow-container {
		pointer-events: none
	}
	.snowflake {
		position: absolute;
		z-index: 2000;
		width: 10px;
		height: 10px;
		background: linear-gradient(white, white);
		border-radius: 50%;
		filter: drop-shadow(0 0 10px white);
	}
`;

const snowContainer = document.createElement('div');
snowContainer.id = 'snow-container';
document.body.prepend(snowContainer);

const toggleSnow = document.getElementById('toggle_snow');

(function snowState() {
	if (toggleSnow.checked) {
		snowContainer.style.display = 'block';
		localStorage.bg = true;
	}

	if (localStorage.snow) {
		toggleSnow.checked = true;
		snowContainer.style.display = 'block';
	}
	else {
		toggleSnow.checked = false;
		snowContainer.style.display = 'none';
	}

	toggleSnow.onclick = function() {
		if (this.checked) {
			snowContainer.style.display = 'block';
			localStorage.snow = true;
		}
		else {
			snowContainer.style.display = 'none';
			localStorage.snow = '';
		}
	}
})();

function spawnSnow(snowDensity = 200) {
	snowDensity -= 1;

	for (let x = 0; x < snowDensity; x++) {
		let board = document.createElement('div');
		board.className = 'snowflake';

		document.getElementById('snow-container').appendChild(board);
	}
}

function addStyle(rule) {
	let css = document.createElement('style');
	css.type = 'text/css';
	css.appendChild(document.createTextNode(rule)); // Support for the rest
	document.getElementsByTagName('head')[0].appendChild(css);
}


function randomInt(value = 100){
	return Math.floor(Math.random() * value) + 1;
}

function randomRange(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


function spawnSnowCSS(snowDensity = 200) {
	const snowflakeClassName = 'snowflake';

	let rule = baseStyles ? baseStyles : '';
	
	for (let i = 1; i < snowDensity; i++) {
		const random_x = Math.random() * 100, // vw
		random_offset = randomRange(-100000, 100000) * 0.0001, // vw,
		random_x_end = random_x + random_offset,
		random_x_end_yoyo = random_x + (random_offset / 2),
		random_yoyo_time = randomRange(30000, 80000) / 100000,
		random_yoyo_y = random_yoyo_time * 100, // vh
		random_scale = Math.random(),
		fall_duration = randomRange(10, 30) * 1, // s
		fall_delay = randomInt(30) * -1, // s
		opacity_ = Math.random();

		rule += `
		.${snowflakeClassName}:nth-child(${i}) {
			opacity: ${opacity_};
			transform: translate(${random_x}vw, -10px) scale(${random_scale});
			animation: fall-${i} ${fall_duration}s ${fall_delay}s linear infinite;
		}

		@keyframes fall-${i} {
			${random_yoyo_time*100}% {
				transform: translate(${random_x_end}vw, ${random_yoyo_y}vh) scale(${random_scale});
			}

			to {
				transform: translate(${random_x_end_yoyo}vw, 100vh) scale(${random_scale});
			}
			
		}
		`;
	}

	addStyle(rule);
}

spawnSnowCSS(snowflakesCount);
spawnSnow(snowflakesCount);


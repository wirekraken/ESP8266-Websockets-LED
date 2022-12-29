(() => {

	const canvasColorPicker = document.getElementById('colorpicker');

	const colorPicker = new KellyColorPicker({
		place : canvasColorPicker
	});

	colorPicker.getWheel().width += 14; // ring width 
	colorPicker.getSvFigCursor().radius += 10; // width of the small ring
	colorPicker.getWheelCursor().height += 5; // slider size
	colorPicker.resize(260); // total ring size

	let isActive = false;

	// positioning
	colorPickerBlock.style.top = currentEffectELem.offsetTop - (colorPickerBlock.clientHeight / 3) + 'px';
	colorPickerBlock.style.display = 'none';

	// ------------------- fix me -----------------------
	// intervention error
	try {
		document.createEvent('touchevent'); // check the touch screen

		canvasColorPicker.addEventListener('touchstart', clickDown);
		canvasColorPicker.addEventListener('touchend', clickUp);
		canvasColorPicker.addEventListener('touchmove', clickMove);
	}
	catch (e) {
		canvasColorPicker.addEventListener('mousedown', clickDown);
		canvasColorPicker.addEventListener('mouseup', clickUp);
		canvasColorPicker.addEventListener('mousemove', clickMove);
	}

	function clickDown() {
		isActive = true;
		togglePlay.checked = false;
	}

	function clickUp() {
		isActive = false;
		canvasColorPicker.style.boxShadow = `0px 0px 10px 10px ${colorPicker.getCurColorHex()} inset, 0 0 10px ${colorPicker.getCurColorHex()}`;

		const payload = colorPicker.getCurColorHex();

		console.log(payload);
		webSocket.send(payload);
	}

	let lastSend = 0;

	function clickMove() {
		if (isActive) {  
			canvasColorPicker.style.boxShadow = `0px 0px 10px 10px ${colorPicker.getCurColorHex()} inset, 0 0 10px ${colorPicker.getCurColorHex()}`;

			const payload = colorPicker.getCurColorHex();
			const now = (new Date).getTime();

			if (lastSend > now - 100) return; // send data no more than 100ms

			lastSend = now;

			console.log(payload);
			webSocket.send(payload);
		}
		
	}
})();
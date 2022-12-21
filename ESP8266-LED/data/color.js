const colorPicker = new KellyColorPicker({
    place : 'picker'
});

colorPicker.getWheel().width += 20; // ring width 
colorPicker.getSvFigCursor().radius += 10; // width of the small ring
colorPicker.getWheelCursor().height += 5; // slider size
colorPicker.resize(340); // total ring size

let isActive = false;

try {
	document.createEvent('touchevent'); // check the touch screen

	picker.addEventListener('touchstart', clickdown);
	picker.addEventListener('touchend', clickup);
	picker.addEventListener('touchmove', clickmove);
}
catch (e) {
	picker.addEventListener('mousedown', clickdown);
	picker.addEventListener('mouseup', clickup);
	picker.addEventListener('mousemove', clickmove);
}

function clickdown() {
	isActive = true;
}

function clickup() {
	isActive = false;

	document.body.style.background = colorPicker.getCurColorHex();
	const color = colorPicker.getCurColorHex();

	console.log(color);
	webSocket.send(color);
}

let lastSend = 0;

function clickmove() {
	if (isActive) {  
  		document.body.style.background = colorPicker.getCurColorHex();

  		const color = colorPicker.getCurColorHex();
  		const now = (new Date).getTime();

  		if (lastSend > now - 100) return; // send data no more than 100ms

  		lastSend = now;

		console.log(color);
		webSocket.send(color);
	}
	
}

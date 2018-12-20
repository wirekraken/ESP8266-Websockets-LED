var colorPicker = new KellyColorPicker({
    place : 'picker'
});

colorPicker.getWheel().width += 20; // ширина кольца 
colorPicker.getSvFigCursor().radius += 10; // ширина малого кольца
colorPicker.getWheelCursor().height += 5; // размер ползунка
colorPicker.resize(340); // общий размер кольца

var Socket = new WebSocket('ws://' + window.location.hostname + ':81/');

var is_active = false; // флаг нажатия

try{
	document.createEvent("touchevent"); //проверка на сенсор

	picker.addEventListener("touchstart", clickdown);
	picker.addEventListener("touchend", clickup);
	picker.addEventListener("touchmove", clickmove);
}
catch(e){ 
	picker.addEventListener("mousedown", clickdown);
	picker.addEventListener("mouseup", clickup);
	picker.addEventListener("mousemove", clickmove);
}

function clickdown(){
	is_active = true;
}

function clickup(){
	is_active = false;
	document.body.style.background = colorPicker.getCurColorHex();
	var send = colorPicker.getCurColorHex();

	console.log(send);
	Socket.send(send);
}

var lastSend = 0;

function clickmove(){
	if(is_active){  
  		document.body.style.background = colorPicker.getCurColorHex();
  		var send = colorPicker.getCurColorHex();

  		var now = (new Date).getTime();
  		if (lastSend > now - 20) return; //оправляем данные не чаще в 20мс
  		lastSend = now;

		console.log(send);
		Socket.send(send);
	}
}

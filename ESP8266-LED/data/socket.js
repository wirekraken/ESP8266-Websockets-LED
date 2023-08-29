let ws;

function wsConnect() {
	console.log('Trying to open a WebSocket connection...');
	ws = new WebSocket('ws://' + window.location.hostname + ':81/');
	ws.onopen = onOpen;
	ws.onclose = onClose;
	ws.onerror = onError;
	// ws.onmessage = onMessage;
}

// function onMessage(payload) {
// 	messageHandler(payload.data);
// 	console.log('Received: ', payload.data);
// }

function onClose(e) {
	console.log('Connection closed ', e);
	setTimeout(wsConnect, 1000);
}

function onError(e) {
	console.log(`[error] ${ e }`);
}

function onOpen() {
	console.log('Connection is success');

}

export { wsConnect, ws };
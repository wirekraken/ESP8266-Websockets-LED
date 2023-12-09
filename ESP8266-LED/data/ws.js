import { UI } from './init.js';

let ws;

function wsConnect() {
  UI.error.ws.style.display = 'flex';
  
  ws = new WebSocket('ws://' + window.location.hostname + ':8080');
  ws.onopen = onOpen;
  ws.onclose = onClose;
  ws.onerror = onError;

}

function onClose(e) {
  setTimeout(wsConnect, 1000);
}

function onError(e) {
  console.log(`[Error] ${e}`);
  UI.error.ws.style.display = 'flex';
}

function onOpen() {
  UI.error.ws.style.display = 'none';
}

export { wsConnect, ws };
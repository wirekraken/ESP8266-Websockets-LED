import UI from './ui.js';
import { onMessage } from './update.ui.js'


let ws;

function wsConnect() {
  UI.error.ws.style.display = 'flex';
  
  ws = new WebSocket('ws://' + window.location.hostname + ':8080');
  ws.onopen = onOpen;
  ws.onclose = onClose;
  ws.onerror = onError;
  ws.onmessage = onMessage;

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
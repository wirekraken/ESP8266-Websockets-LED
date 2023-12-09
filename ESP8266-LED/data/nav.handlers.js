import UI from './ui.js';
import { ws } from './ws.js';
import { updateList } from './update.ui.js';


const COUNT = UI.content.effectsList.children.length;

UI.panel.btnBlock.togglePlay.onclick = function() {
  const prepData = (this.checked) ? 'P1' : 'P0';
  console.log(prepData);
  ws.send(prepData);
};

UI.panel.btnBlock.toggleLoop.onclick = function() {
  let prepData;
  if (this.checked) {
    UI.panel.btnBlock.togglePlay.checked = true;
    UI.panel.btnBlock.toggleRandom.checked = false;
    prepData = 'L1';
  }
  else {
    prepData = 'L0';
  }

  console.log(prepData);
  ws.send(prepData);
};

UI.panel.btnBlock.toggleRandom.onclick = function() {
  let prepData;
  if (this.checked) {
    UI.panel.btnBlock.togglePlay.checked = true;
    UI.panel.btnBlock.toggleLoop.checked = false;
    prepData = 'R1';
  }
  else {
    prepData = 'R0';
  }
  
  console.log(prepData);
  ws.send(prepData);
};

UI.panel.btnBlock.prevButton.onclick = function() {
  UI.panel.btnBlock.togglePlay.checked = true;

  if (+localStorage.currentEffect === 1) {
    localStorage.currentEffect = COUNT;
    console.log('one')
  }
  else {
    --localStorage.currentEffect;
  }

  updateList();

  const prepData = 'E' + localStorage.currentEffect;
  console.log(prepData);
  ws.send(prepData);
};

UI.panel.btnBlock.nextButton.onclick = function() {

  if (!UI.panel.btnBlock.togglePlay.checked) {
    localStorage.currentEffect = 0;
  }

  UI.panel.btnBlock.togglePlay.checked = true;
  
  if (+localStorage.currentEffect === COUNT) {
    localStorage.currentEffect = 1;
  }
  else {
    ++localStorage.currentEffect;
  }

  updateList();

  const prepData = 'E' + localStorage.currentEffect;
  console.log(prepData);
  ws.send(prepData);
};

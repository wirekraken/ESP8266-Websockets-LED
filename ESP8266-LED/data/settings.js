import { UI, updateList } from './init.js';

// prepare background
(() => {
  const backgroundImage = 'background/bg.jpg';
  const backgroundRadial = 'radial-gradient(rgba(20, 26, 73, 0.6), rgb(0, 0, 0))';

  if (UI.settings.toggleBgImage.checked) {
    UI.content.block.style.backgroundImage = `url(${backgroundImage})`;
    localStorage.bgImage = true;
  }

  if (localStorage.bgImage) {
    UI.settings.toggleBgImage.checked = true;
    UI.content.block.style.backgroundImage = `url(${backgroundImage})`;
  }
  else {
    UI.settings.toggleBgImage.checked = false;
    UI.content.block.style.backgroundImage = backgroundRadial;
  }

  UI.settings.toggleBgImage.onclick = function() {
    if (this.checked) {
      UI.content.block.style.backgroundImage = `url(${backgroundImage})`;
      localStorage.bgImage = true;
      return;
    }
    UI.content.block.style.backgroundImage = backgroundRadial;
    localStorage.bgImage = '';
  };
})();


let checkedThemeColor;

UI.settings.togglePanelFill.onclick = function() {
  if (this.checked) {
    UI.panel.block.style.background = checkedThemeColor;
    return;
  }
  UI.panel.block.style.background = '';
};

if (localStorage.themeColor) {
  document.querySelector('.theme_' + localStorage.themeColor).checked = true;
  console.log(localStorage.themeColor)
}


for (const themeSetter of UI.settings.themeSetters) {
  themeSetter.onclick = changeThemeHandler;

  if (!themeSetter.checked) continue;
  checkedThemeColor = themeSetter.dataset.themeColor;

  UI.panel.block.style.background = (UI.settings.togglePanelFill.checked) && checkedThemeColor;

  localStorage.themeColor = checkedThemeColor;
  app.style.background = checkedThemeColor;
  setAddressBarColor(checkedThemeColor);
  setRangeElemsColor(checkedThemeColor);
  UI.content.main.currentEffectELem.style.background = checkedThemeColor;
 
}

function changeThemeHandler() {
  const color = this.dataset.themeColor;
  // checkedThemeColor = color;
  localStorage.themeColor = color;
  app.style.background = color;

  UI.content.main.currentEffectELem.style.background = color;

  setAddressBarColor(color);
  setRangeElemsColor(color);
  updateList(color);

  UI.panel.block.style.background = (UI.settings.togglePanelFill.checked) && color;

}

// setAddressBarColor('darkblue')

function setRangeElemsColor(color) {
  const rangeElems = document.querySelectorAll('.led_controls_rng .range');
  rangeElems.forEach(elem => {
    elem.style.backgroundImage = `linear-gradient(${color}, ${color})`;
  });
}

function setAddressBarColor(color) {
  const metaThemeColor = document.querySelector('meta[name=theme-color]');
  metaThemeColor.setAttribute('content', color);
}

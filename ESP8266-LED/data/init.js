const UI = {
  panel: {
    block: document.querySelector('.panel'),
    btnBlock: {
      togglePlay: document.querySelector('.toggle_play'),
      prevButton: document.querySelector('.prev_btn'),
      nextButton: document.querySelector('.next_btn'),
      toggleLoop: document.getElementById('toggle_loop'),
      toggleRandom: document.getElementById('toggle_random')
    }
  },
  header: {
    block: document.querySelector('.header'),

    toggleColorPicker: document.querySelector('.toggle_colorpicker'),
    toggleSettings: document.querySelector('.toggle_settings'),
    toggleContent: document.querySelector('.toggle_content'),

    colorPickerBlock: document.querySelector('.colorpicker_block'),
    canvasColorPicker: document.getElementById('colorpicker'),
    settingsBlock: document.querySelector('.settings_block')
  },
  content: {
    block: document.querySelector('.content'),
    effectsList: document.querySelector('.content .effects_list'),
    effectElems: document.querySelectorAll('.effects_list span'),
    main: {
      block: document.querySelector('.content .content_main'),
      currentEffectELem: document.querySelector('.content_main .current_effect'),
      rangeBlock: {
        rangeBrightness: document.querySelector('.range_brightness'),
        brightnessValue: document.querySelector('.brightness_value'),
        rangeDuration: document.querySelector('.range_duration'),
        durationValue: document.querySelector('.duration_value')
      }
    }
  },
  settings: {
    themeSetters: document.querySelectorAll('.theme_setter_block .theme_setter'),
    togglePanelFill: document.querySelector('.toggle_panel_fill'),
    toggleBgImage: document.querySelector('.toggle_bg')
  },
  error: {
    ws: document.querySelector('.error_ws')
  }
}

const updateList = (color) => {
  UI.content.main.currentEffectELem.innerText = UI.content.effectElems[+localStorage.currentEffect - 1].innerText;
  UI.content.effectElems.forEach(elem => elem.style.background = '');
  // if (+(UI.content.effectElems[+localStorage.currentEffect - 1].dataset.effect) > 17) {
  //  background = '#cd5300';
  // }
  UI.content.main.currentEffectELem.style.background = color;
  UI.content.effectElems[+localStorage.currentEffect - 1].style.background = color;

}

export { UI, updateList };
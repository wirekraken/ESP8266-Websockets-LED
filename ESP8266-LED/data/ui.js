export default {
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
        brightness: {
          input: document.querySelector('.range_brightness'),
          output: document.querySelector('.brightness_output')
        },
        duration: {
          input: document.querySelector('.range_duration'),
          output: document.querySelector('.duration_output')
        }
      }
    }
  },
  settings: {
    themeSetters: document.querySelectorAll('.theme_setter_block .theme_setter'),
    togglePanelFill: document.querySelector('.toggle_panel_fill'),
    toggleBgImage: document.querySelector('.toggle_bg'),
    toggleSnow: document.querySelector('.toggle_snow')
  },
  error: {
    ws: document.querySelector('.error_ws')
  }

};

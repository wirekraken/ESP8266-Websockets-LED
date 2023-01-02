const char html[] PROGMEM = R"=====(
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>led controller</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
    <meta name="theme-color" content="#333"/>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #ccc;
        color-scheme: dark;
        text-shadow: 0 1px 2px #000;
        user-select: none;
      }
      #app {
        background-image: radial-gradient(rgba(20, 26, 73, 0.6), rgb(0, 0, 0));
        position: fixed;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      #rangeBlock {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 6px;
        gap: 6px;
        font-size: 20px;
      }
      #rangeBlock > div {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      #rangeBlock > div > span {
        width: 100px;
      }
      #rangeBlock output {
        width: 40px;
      }
      #panel {
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-weight: bold;
        position: fixed;
        height: 70px;
        width: 100vw;
        left: 0;
        right: 0;
        bottom: 0;
      }
      #effectsList {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 22px;
        /* height: calc(100vh - 200px); */
        overflow-y: auto;
        gap: 5px;
        font-size: 22px;
      }
      #effectsList span {
        background: #090a0f;
        color: #ddd;
        border-radius: 3px;
        padding: 7px;
      }
      #effectsList span:first-child {
        margin-top: 10px;
      }
      #effectsList span:last-child {
        margin-bottom: 10px;
      }
      label {
        font-size: 20px;
        padding: 8px;
        background: gray;
        color:#eee;
        border-radius: 4px;
      }
      button {
        font-size: 30px;
      }
      input[type=range] {
        width: 200px;
      }
      input[type=checkbox] {
        display: none;
      }
      input[type=checkbox]:checked ~ label {
        background-color: #333;
      }
    
      @media only screen and (min-width: 600px) {
        #panel {
          height: 50px;
          top: 0;
          justify-content: center;
          gap: 30px;
        }
        #effectsList {
          font-size: 24px;
        }
        #effectsList span {
          font-size: 18px;
        }
        #rangeBlock {
          margin-top: 70px;
        }
        label, input, button, #effectsList span {
          cursor: pointer;
        }
        label {
          font-size: 16px;
        }
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div id="rangeBlock">
        <div>
          <span>brigthness</span>
          <input id="rangeBrightness" oninput="outputBrigthness.value=this.value" type="range" value="25" min="0" max="100"/>
          <output id="outputBrigthness">25</output>
        </div>
        <div>
          <span>duration</span>
          <input id="rangeDuration" onchange="outputDuration.value=this.value+'s'" type="range" value="10" min="2" max="60"/>
          <output id="outputDuration">10s</output>
        </div>
      </div>
      <div id="currentEffectElem" style="font-size:28px;text-align:center; display:inline">rainbow fade</div>
      <div id="effectsList">
        <span data-effect="1">rainbow fade</span>
        <span data-effect="2">rainbow loop</span>
        <span data-effect="3">rainbow loop fade</span>
        <span data-effect="4">rainbow vertical</span>
        <span data-effect="5">random march</span>
        <span data-effect="6">rgb propeller</span>
        <span data-effect="7">fire</span>
        <span data-effect="8">blue fire</span>
        <span data-effect="9">random burst</span>
        <span data-effect="10">flicker</span>
        <span data-effect="11">random color pop</span>
        <span data-effect="12">sparkle</span>
        <span data-effect="13">color bounce</span>
        <span data-effect="14">color bounce fade</span>
        <span data-effect="15">blue red bounce</span>
        <span data-effect="16">rotating red blue</span>
        <span data-effect="17">matrix</span>
        <span data-effect="18">radiation</span>
        <span data-effect="19">pacman</span>
        <span data-effect="20">pop horizontal</span>
        <span data-effect="21">snow sparkle</span>
        <span data-effect="22">rwb march</span>
        <span data-effect="23">flame</span>
        <span data-effect="24">theater chase</span>
        <span data-effect="25">strobe</span>
        <span data-effect="26">police blinker</span>
        <span data-effect="27">kitt</span>
        <span data-effect="28">rule</span>
        <span data-effect="29">fade vertical</span>
        <span data-effect="30">fade to center</span>
        <span data-effect="31">runner chameleon</span>
        <span data-effect="32">blende</span>
        <span data-effect="33">blende 2</span>
      </div>
      <div id="panel">
        <div>
          <input id="toggleLoop" type="checkbox"/>
          <label for="toggleLoop">LOOP</label>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button id="prevButton"><</button>
          <div>
            <input id="togglePlay" type="checkbox"/>
            <label for="togglePlay">PLAY</label>
          </div>
          <button id="nextButton">></button>
        </div>
        <div>
          <input id="toggleRandom" type="checkbox"/>
          <label for="toggleRandom">RAND</label>
        </div>
      </div>
    </div>
    <script>

      window.onload = () => initWebSocket();

      // silver orangered yellowgreen royalblue
      const themeColor = 'silver';
      // set theme color
      (function(color) {
        document.body.style.background = color;
        panel.style.background = color;
        const metaThemeColor = document.querySelector('meta[name=theme-color]');
        metaThemeColor.setAttribute('content', color);
      }(themeColor));

      // positioning
      effectsList.style.height = document.documentElement.clientHeight - (panel.clientHeight + rangeBlock.clientHeight + currentEffectElem.clientHeight + 20) + 'px';

      const COUNT = effectsList.children.length; // effects count
      let currentEffect = 1;

      let webSocket;
      function initWebSocket() {
        console.log('Trying to open a WebSocket connection...');
        webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');
        webSocket.onopen = onOpen;
        webSocket.onclose = onClose;
        webSocket.onerror = onError;
        webSocket.onmessage = onMessage;
      }

      function onMessage(payload) {
        messageHandler(payload.data);
        console.log('Received: ', payload.data);
      }

      function onClose(e) {
        console.log('Connection closed ', e);
        setTimeout(initWebSocket, 1000);
      }

      function onError(e) {console.log(`[error] ${ e }`)}
      function onOpen() {console.log('Connection is success')}

      function messageHandler(payload) {
        let getData = (+payload.replace(/\D/g, ""));
        switch(payload[0]) {
          case 'E':
            togglePlay.checked = true;
            currentEffect = getData;
            updateList(themeColor); // if handled by the server
          break;
          case 'B':
            rangeBrightness.value = getData;
            outputBrigthness.value = getData;
          break;
          case 'D':
              rangeDuration.value = getData;
              outputDuration.value = getData;
          break;
          case 'P':
            if (getData === 1) {
              togglePlay.checked = true;
            }
            else {
              togglePlay.checked = false;
            }
          break;
          case 'L':
            if (getData === 1) {
              togglePlay.checked = true;
              toggleLoop.checked = true;
              toggleRandom.checked = false;
            }
            else {
              toggleLoop.checked = false;
            }
          break;
          case 'R':
            if (getData === 1) {
              togglePlay.checked = true;
              toggleRandom.checked = true;
              toggleLoop.checked = false;
            }
            else {
              toggleRandom.checked = false;
            }
          break;
        }
      }

      for (let item of effectsList.children) {
        item.onclick = function() {
          currentEffect = this.dataset.effect;
          togglePlay.checked = true;
          updateList('rgba(100,100,100,.5');

          const payload = 'E_' + this.dataset.effect;
          console.log(payload);
          webSocket.send(payload);
        };
      }
      
      let lastSend;
      rangeBrightness.addEventListener('input', function() {
        let payload = 'B_' + this.value;

        const now = (new Date).getTime();
        if (lastSend > now - 50) return; // send data no more than 50ms
        lastSend = now;

        console.log(payload);
        webSocket.send(payload);
      });

      try {
        document.createEvent('touchevent'); // check the touch screen
        rangeBrightness.addEventListener('touchend', clickEnd);
      }
      catch (e) {
        rangeBrightness.addEventListener('mouseup', clickEnd);
      }

      function clickEnd() { // fixes if move the range quickly
        const payload = 'B_' + this.value;
        console.log(payload);
        webSocket.send(payload);
      }

      rangeDuration.addEventListener('change', function() {
        const payload = 'D_' + this.value;
        console.log(payload);
        webSocket.send(payload);
      });

      togglePlay.onclick = function() {
        let payload = (this.checked) ? 'P_1' : 'P_0';
        console.log(payload);
        webSocket.send(payload);
      };

      toggleLoop.onclick = function() {
        let payload;
        if (this.checked) {
          togglePlay.checked = true;
          toggleRandom.checked = false;
          payload = 'L_1';
        }
        else {
          payload = 'L_0';
        }
        console.log(payload);
        webSocket.send(payload);
      };

      toggleRandom.onclick = function() {
        let payload;
        if (this.checked) {
          togglePlay.checked = true;
          toggleLoop.checked = false;
          payload = 'R_1';
        }
        else {
          payload = 'R_0';
        }
        console.log(payload);
        webSocket.send(payload);
      };

      prevButton.onclick = function() {
        togglePlay.checked = true;
        if (currentEffect === 1) {
          currentEffect = COUNT;
        }
        else {
          --currentEffect;
        }
        updateList('rgba(100,100,100,.5');
        const payload = 'E_' + currentEffect;

        console.log(payload);
        webSocket.send(payload);
      };

      nextButton.onclick = function() {
        if (!togglePlay.checked) {
          currentEffect = 0;
        }
        togglePlay.checked = true;
        if (currentEffect === COUNT) {
          currentEffect = 1;
        }
        else {
          ++currentEffect;
        }
        updateList('rgba(100,100,100,.5');
        const payload = 'E_' + currentEffect;

        console.log(payload);
        webSocket.send(payload);
      };

      function updateList(color) {
        currentEffectElem.innerText = effectsList.children[currentEffect - 1].innerText;
        Array.from(effectsList.children, e => e.style.background = '');
        effectsList.children[currentEffect - 1].style.background = color;
      }
    </script>
  </body>
</html>
)=====";

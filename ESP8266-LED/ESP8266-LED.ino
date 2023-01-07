/**
 * @author   Alexander Voykov <wirekraken>
 * @version  2.0
 * @link     https://github.com/wirekraken/ESP8266-Websockets-LED
**/

#include <ESP8266WebServer.h> // auto installed after installing ESP boards
#include <WebSocketsServer.h> // by Markus Settler

// the SPIFFS upload function is not currently supported on Arduino 2.0
// use 1.8.x version
// see: https://github.com/arduino/arduino-ide/issues/58
#include <FS.h>
#include <FastLED.h> // by Daniel Garcia

#define LED_COUNT 60 // the number of pixels on the strip
#define DATA_PIN 14 // (D5 nodemcu), important: https://github.com/FastLED/FastLED/wiki/ESP8266-notes

// SSID and password of the access point
const char* ssid = "HUAWEI-T8xP";
const char* password = "fBAB4z5Q";

// static IP address configuration
IPAddress Ip(192,168,100,10); // IP address for your ESP
IPAddress Gateway(192,168,100,1); // IP address of the access point
IPAddress Subnet(255,255,255,0); // subnet mask

// default values. You will change them via the Web interface
uint8_t brightness = 25;
uint32_t duration = 10000; // (10s) duration of the effect in the loop
uint8_t effect = 0;

bool isPlay = false;
bool isLoopEffect = false;
bool isRandom = false;
bool isColorPicker = false;

// effects that will be in the loop
uint8_t favEffects[] = {1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33};
uint8_t numFavEffects = sizeof(favEffects);

uint32_t lastChange;
uint8_t currentEffect = 0;


CRGBArray<LED_COUNT> leds;
// variables for basic effects settings
uint8_t _delay = 20;
uint8_t _step = 10;
uint8_t _hue = 0;
uint8_t _sat = 255;

// initializing the websocket server on port 81
WebSocketsServer webSocket(81);
ESP8266WebServer server; // 80 default

void setup() {
  Serial.begin(9600);

  // tell FastLED about the LED strip configuration
  LEDS.addLeds<WS2811, DATA_PIN, GRB>(leds, LED_COUNT);
  // set the brightness
  LEDS.setBrightness(brightness);
  updateColor(0,0,0);
  LEDS.show(); // set new changes for led

  WiFi.config(Ip, Gateway, Subnet);
  WiFi.begin(ssid, password);
  Serial.println("");

  // wait for connection
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500);
    Serial.print(".");
  }
  
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP()); // IP adress assigned to your ESP

  server.onNotFound([]() {
    if (!handleFileRead(server.uri())) // check if the file exists in the flash memory, if so, send it
      server.send(404, "text/plain", "404: File Not Found");
  });
  
  SPIFFS.begin(); // mount the SPIFFS file system
  server.begin();
  webSocket.begin();

  // binding callback function
  webSocket.onEvent(webSocketEvent);
  
}

void loop() {

  webSocket.loop(); // constantly check for websocket events
  server.handleClient(); // run the web server

  if (isPlay) {
    String sendData;

    if (isLoopEffect) {
      if ((millis() - lastChange) > duration) {
        setFavEffects(favEffects, numFavEffects);
    
        sendData = "E" + String(currentEffect, DEC);
        webSocket.broadcastTXT(sendData);
        Serial.println("Sent: " + sendData);
        
      }
    }
    if (isRandom) {
      if ((millis() - lastChange) > duration) {
        lastChange = millis();
        effect = favEffects[random(0, numFavEffects - 1)];
        currentEffect = effect - 1;

        sendData = "E" + String(effect, DEC);
        webSocket.broadcastTXT(sendData); // send the number of the current effect
        Serial.println("Sent: " + sendData);
      
      }
    }
    setEffect(effect);
  }

}

void setFavEffects(const uint8_t *arr, uint8_t count) {
  if (currentEffect > (count - 1)) {
    currentEffect = 0;
  }
  effect = arr[currentEffect++];
  lastChange = millis();
}

// the callback for handling incoming data
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

  // if a new websocket connection is established
  if (type == WStype_CONNECTED) {
    IPAddress ip = webSocket.remoteIP(num);

    // !!!!!!!!!!!!!!!!!!!!!!!!must be shown in the web interface!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    webSocket.sendTXT(num, "Websocket established!"); // send status message
    Serial.println("New client connected! Num: " + String(num));
  }
  // if new text data is received
  if (type == WStype_TEXT) {
    Serial.printf("Client[%u] Received: %s\n", num, payload);
    messageHandler(num, payload, length);
    
  } 
}

void messageHandler(uint8_t num, uint8_t * payload, size_t length) {

  String getData;
  String sendData;

  uint16_t lastSend;

  for (uint8_t i = 0; i < length; i++) {
    if (i == 0) continue;
    getData += (char) payload[i];
  }

  switch (payload[0]) {
    // effect
    case 'E':
      isPlay = true;
      effect = getData.toInt();
      Serial.println(getData);

      currentEffect = getData.toInt() - 1; // so that the loop starts from the current one

      sendData = "E" + getData;
      webSocket.broadcastTXT(sendData);
      
      setEffect(effect);
    break;
    // brightness
    case 'B':
      Serial.println(getData);
      brightness = map(getData.toInt(), 0, 100, 0, 255);

      sendData = "B" + getData;
      webSocket.broadcastTXT(sendData);
      
      LEDS.setBrightness(brightness);
    break;
    // duration
    case 'D':
      Serial.println(getData);
      duration = (getData.toInt() * 1000);

      sendData = "D" + getData;
      webSocket.broadcastTXT(sendData);
    break;
    // play
    case 'P':
      if (getData == "1") {
        isPlay = true;
        if (effect == 0) {
          effect = 1;
        }
        sendData = "E" + String(effect, DEC);
        webSocket.broadcastTXT(sendData);
      } 
      else {
        isPlay = false;
      }
      sendData = "P" + getData;
      webSocket.broadcastTXT(sendData);
    break;
    // loop
    case 'L':
      if (getData == "1") {
        isPlay = true;
        isLoopEffect = true;
        isRandom = false;
      } 
      else {
        isLoopEffect = false;
      }
      sendData = "L" + getData;
      webSocket.broadcastTXT(sendData);
    break;
    // random
    case 'R':
      if (getData == "1") {
        isPlay = true;
        isLoopEffect = false;
        isRandom = true;
      } 
      else {
        isRandom = false;
      }
      sendData = "R" + getData;
      webSocket.broadcastTXT(sendData);
    break;
    // color (in hex format)
    case '#':
      isPlay = false;
      isColorPicker = true;
      // decode HEX to RGB
      uint32_t rgb = (uint32_t) strtol((const char *) &payload[1], NULL, 16);
      
      uint8_t r = (rgb >> 16) & 0xFF;
      uint8_t g = (rgb >>  8) & 0xFF;
      uint8_t b = (rgb >>  0) & 0xFF;
      
      // Serial.println("Client " + String(num) + ": Color: (" + String(r) + "," + String(g) + "," + String(b) + ")");
      
      for (int i = 0; i < LED_COUNT; i++) {
        leds[i].setRGB(r,g,b);
      }
      LEDS.show();

      if ((millis() - lastSend) > 2000) { // we send it no more than in 2 seconds
        lastSend = millis();
        sendData = "#" + getData;
        
      }
      webSocket.broadcastTXT(sendData);

    break;
  }
  Serial.println("Sent: " + sendData);
}

// call the desired effect
void setEffect(const uint8_t num) {
  switch(num) {
    case 0: updateColor(0,0,0); break;
    case 1: rainbowFade(); _delay = 20; break;
    case 2: rainbowLoop(); _delay = 20; break;
    case 3: rainbowLoopFade(); _delay = 5; break;
    case 4: rainbowVertical(); _delay = 50; _step = 15; break;
    case 5: randomMarch(); _delay = 40; break;  
    case 6: rgbPropeller(); _delay = 25; break;
    case 7: fire(55, 120, _delay); _delay = 15; break; 
    case 8: blueFire(55, 250, _delay); _delay = 15; break;  
    case 9: randomBurst(); _delay = 20; break;
    case 10: flicker(); _delay = 20; break;
    case 11: randomColorPop(); _delay = 35; break;
    case 12: sparkle(255, 255, 255, _delay); _delay = 0; break;
    case 13: colorBounce(); _delay = 20; _hue = 0; break;
    case 14: colorBounceFade(); _delay = 40; _hue = 0; break;
    case 15: redBlueBounce(); _delay = 40; _hue = 0; break;
    case 16: rotatingRedBlue(); _delay = 40; _hue = 0; break;
    case 17: matrix(); _delay = 50; _hue = 95; break;
    case 18: radiation(); _delay = 60; _hue = 95; break;
    case 19: pacman(); _delay = 60; break;
    case 20: popHorizontal(); _delay = 100; _hue = 0; break;
    case 21: snowSparkle(); _delay = 20; break;

    // heavy effects (have nested loops and long delays)
    // don't be surprised when your ESP will slow down with a quick change of brightness for them
    case 22: rwbMarch(); _delay = 80; break;
    case 23: flame(); break;
    case 24: theaterChase(255, 0, 0, _delay); _delay = 50; break;
    case 25: strobe(255, 255, 255, 10, _delay, 1000); _delay = 100; break;
    case 26: policeBlinker(); _delay = 25; break;
    case 27: kitt(); _delay = 100; break;
    case 28: rule30(); _delay = 100; break;
    case 29: fadeVertical(); _delay = 60; _hue = 180; break;
    case 30: fadeToCenter(); break;
    case 31: runnerChameleon(); break;
    case 32: blende(); break;
    case 33: blende_2();

  }
}
  
// send the right file to the client (if it exists)
bool handleFileRead(String path) {
  #ifdef DEBUG
    Serial.println("handleFileRead: " + path);
  #endif
  if (path.endsWith("/")) path += "index.html";
  if (SPIFFS.exists(path)) {
    File file = SPIFFS.open(path, "r");
    size_t sent = server.streamFile(file, getContentType(path));
    file.close();
    return true;
  }
  return false;
  
}

// determine the MIME type of file
String getContentType(String filename) {
  if (server.hasArg("download")) return "application/octet-stream";
  else if(filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".svg")) return "image/svg+xml";
  return "text/plain";

}

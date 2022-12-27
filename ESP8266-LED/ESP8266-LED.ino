/*
* ESP8266-Websockets-LED: https://github.com/wirekraken/ESP8266-Websockets-LED
*/

#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <FS.h>
#include <FastLED.h>

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
uint8_t ledMode = 0;
bool isColorPicker = true; // flag to switch between the colorpicker and effects

CRGBArray<LED_COUNT> leds;

uint8_t _delay = 20;
uint8_t _step = 10;
uint8_t _hue = 0;

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

  setEffect(ledMode);

}

// the callback for handling incoming data
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

   // if a new websocket connection is established
  if (type == WStype_CONNECTED) {
    IPAddress ip = webSocket.remoteIP(num);
    
    webSocket.sendTXT(num, "Websocket established!"); // send status message
    Serial.println("New client connected! Num: " + String(num));
  }
    // if new text data is received
  if (type == WStype_TEXT) {

    Serial.printf("[%u] get Text: %s\n", num, payload);
    String getData;
    String sendData;

    for (int i = 0; i < length; i++) {
      if (!isdigit(payload[i])) continue;
      getData += (char) payload[i];
      
    }
      
    if (payload[0] == 'B') { // brightness
      isColorPicker = false;
      Serial.print("Client " + String(num) + ": Brightness: ");
      brightness = getData.toInt();
      Serial.println(getData);

      sendData = "B_" + String(brightness, DEC);
      webSocket.broadcastTXT(sendData);
      Serial.println("sent: " + sendData);

      LEDS.setBrightness(brightness);

    }
    else if (payload[0] == 'E') { // effect
      isColorPicker = false;
      Serial.print("Client " + String(num) + ": Effect: ");
      ledMode = getData.toInt();
      Serial.println(getData);

      sendData = "E_" + String(ledMode, DEC);
      webSocket.broadcastTXT(sendData);
      Serial.println("sent: " + sendData);
      
      setEffect(ledMode);

    }
    else if (payload[0] == '#') { // color (in hex format)

      if (!isColorPicker) {
        Serial.print("Color picker : ");
        Serial.println(isColorPicker);
        ledMode = isColorPicker;
        setEffect(ledMode);
        isColorPicker = true;

      }
      else {
        // decode HEX to RGB
        uint32_t rgb = (uint32_t) strtol((const char *) &payload[1], NULL, 16);
        
        uint8_t r = (rgb >> 16) & 0xFF;
        uint8_t g = (rgb >>  8) & 0xFF;
        uint8_t b = (rgb >>  0) & 0xFF;
        
        Serial.println("Client " + String(num) + ": Color: (" + String(r) + "," + String(g) + "," + String(b) + ")");
        
        for (int i = 0; i < LED_COUNT; i++) {
          leds[i].setRGB(r,g,b);
        }
        LEDS.show();
        
      }
    }
  } 
}

// call the desired effect
void setEffect(const uint8_t num) { 
    switch(num) {
      case 0: updateColor(0,0,0); break;
      case 1: rainbow_fade(); _delay = 20; break;       
      case 2: rainbow_loop(); _delay = 20; break;
      case 3: new_rainbow_loop(); _delay = 5; break;
      case 4: random_march(); _delay = 40; break;  
      case 5: rgb_propeller(); _delay = 25; break;
      case 6: rotatingRedBlue(); _delay = 40; _hue = 0; break;
      case 7: Fire(55, 120, _delay); _delay = 15; break; 
      case 8: blueFire(55, 250, _delay); _delay = 15; break;  
      case 9: random_burst(); _delay = 20; break;
      case 10: flicker(); _delay = 20; break;
      case 11: random_color_pop(); _delay = 35; break;                                      
      case 12: Sparkle(255, 255, 255, _delay); _delay = 0; break;                   
      case 13: color_bounce(); _delay = 20; _hue = 0; break;
      case 14: color_bounceFADE(); _delay = 40; _hue = 0; break;
      case 15: red_blue_bounce(); _delay = 40; _hue = 0; break;
      case 16: rainbow_vertical(); _delay = 50; _step = 15; break;
      case 17: matrix(); _delay = 50; _hue = 95; break; 
  
      // heavy effects
      case 18: rwb_march(); _delay = 80; break;                         
      case 19: flame(); break;
      case 20: theaterChase(255, 0, 0, _delay); _delay = 50; break;
      case 21: Strobe(255, 255, 255, 10, _delay, 1000); _delay = 100; break;
      case 22: policeBlinker(); _delay = 25; break;
      case 23: kitt(); _delay = 100; break;
      case 24: rule30(); _delay = 100; break;
      case 25: fade_vertical(); _delay = 60; _hue = 180; break;
      case 26: fadeToCenter(); break;
      case 27: runnerChameleon(); break;
      case 28: blende(); break;
      case 29: blende_2();

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

/*
  Скетч разработан 30.11.2018 Wirekraken
*/
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <FS.h>
#include <FastLED.h>

const char* ssid = "ssid"; // имя вашей сети
const char* password = "password"; // пароль вашей сети

IPAddress Ip(192,168,1,10); // IP-адрес для ESP
IPAddress Gateway(192,168,1,1); // IP-адрес шлюза (роутера)
IPAddress Subnet(255,255,255,0); // маска подсети, диапазон IP-адресов в локальной сети
 
#define LED_COUNT 60 // число пикселей в ленте
#define LED_DT 2    // пин, куда подключен DIN ленты (номера пинов ESP8266 совпадает с Arduino)  

uint8_t bright = 25; // яркость (0 - 255)
uint8_t ledMode = 0; // эффект (0 - 29)

uint8_t flag = 1; // флаг отмены эффекта

CRGBArray<LED_COUNT> leds;

uint8_t delayValue = 20; // задержка
uint8_t stepValue = 10; // шаг по пикселям
uint8_t hueValue = 0; // тон цвета

// инициализация websocket на 81 порту
WebSocketsServer webSocket(81);
ESP8266WebServer server(80);

void setup(){
  Serial.begin(9600); 
  LEDS.setBrightness(bright);

  LEDS.addLeds<WS2811, LED_DT, GRB>(leds, LED_COUNT);  // настройки для вашей ленты (ленты на WS2811, WS2812, WS2812B)
  updateColor(0,0,0);
  LEDS.show(); 

  WiFi.config(Ip, Gateway, Subnet);
  WiFi.begin(ssid, password);
  Serial.println("");

  while (WiFi.status() != WL_CONNECTED){ 
    delay(500);
    Serial.print(".");
  }
  
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.onNotFound([](){
    if(!handleFileRead(server.uri()))
      server.send(404, "text/plain", "FileNotFound");
  });
  
  server.begin();

  SPIFFS.begin();
  
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop(){
  //обработка входящих запросов HTTP или WebSockets
  webSocket.loop();
  server.handleClient();

  ledEffect(ledMode);

}

//функция обработки входящих сообщений
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length){
  
   if(type == WStype_CONNECTED){
      IPAddress ip = webSocket.remoteIP(num);

      String message = String("Connected");
      webSocket.broadcastTXT(message);   // отправляем последнее значение всем клиентам при подключении    
    }
    
    if(type == WStype_TEXT){
        String data;
        for(int x = 0; x < length; x++){
          if(!isdigit(payload[x])) continue;
          data += (char) payload[x];
          
        }
        
        if(payload[0] == 'B'){
          flag = 0;
          Serial.print("Bright: ");
          bright = data.toInt();
          Serial.println(data);
          LEDS.setBrightness(bright);

        }  
        else if(payload[0] == 'F'){
          flag = 0;
          Serial.print("Function: ");
          ledMode = data.toInt();
          Serial.println(data);
          ledEffect(ledMode);

        }
        else if(payload[0] == '#'){
  
          if(!flag){
              Serial.print("flag : ");
              Serial.println(flag);
              ledMode = flag;
              ledEffect(ledMode);
              flag = 1;

          }
          else{
           //преобразуем в 24 битное цветовое число
           uint32_t rgb = (uint32_t) strtol((const char *) &payload[1], NULL, 16);
          
           //преобразуем 24 бит по 8 бит на канал 
           uint8_t r = abs(0 + (rgb >> 16) & 0xFF);
           uint8_t g = abs(0 + (rgb >>  8) & 0xFF);
           uint8_t b = abs(0 + (rgb >>  0) & 0xFF);
           
           Serial.print("ColorPicker: ");
           Serial.print(r);
           Serial.print(g);
           Serial.println(b);
           
           for(int x = 0; x < LED_COUNT; x++){
             leds[x].setRGB(r,g,b);
           }
           LEDS.show();
            
          }
       }
   } 
}

// функция эффектов
void ledEffect(int ledMode){ 
    switch(ledMode){
      case 0: updateColor(0,0,0); break;
      case 1: rainbow_fade(); delayValue = 20; break;       
      case 2: rainbow_loop(); delayValue = 20; break;
      case 3: new_rainbow_loop(); delayValue = 5; break;
      case 4: random_march(); delayValue = 40; break;  
      case 5: rgb_propeller(); delayValue = 25; break;
      case 6: rotatingRedBlue(); delayValue = 40; hueValue = 0; break;
      case 7: Fire(55, 120, delayValue); delayValue = 15; break; 
      case 8: blueFire(55, 250, delayValue); delayValue = 15; break;  
      case 9: random_burst(); delayValue = 20; break;
      case 10: flicker(); delayValue = 20; break;
      case 11: random_color_pop(); delayValue = 35; break;                                      
      case 12: Sparkle(255, 255, 255, delayValue); delayValue = 0; break;                   
      case 13: color_bounce(); delayValue = 20; hueValue = 0; break;
      case 14: color_bounceFADE(); delayValue = 40; hueValue = 0; break;
      case 15: red_blue_bounce(); delayValue = 40; hueValue = 0; break;
      case 16: rainbow_vertical(); delayValue = 50; stepValue = 15; break;
      case 17: matrix(); delayValue = 50; hueValue = 95; break; 
  
      // тяжелые эффекты
      case 18: rwb_march(); delayValue = 80; break;                         
      case 19: flame(); break;
      case 20: theaterChase(255, 0, 0, delayValue); delayValue = 50; break;
      case 21: Strobe(255, 255, 255, 10, delayValue, 1000); delayValue = 100; break;
      case 22: policeBlinker(); delayValue = 25; break;
      case 23: kitt(); delayValue = 100; break;
      case 24: rule30(); delayValue = 100; break;
      case 25: fade_vertical(); delayValue = 60; hueValue = 180; break;
      case 26: fadeToCenter(); break;
      case 27: runnerChameleon(); break;
      case 28: blende(); break;
      case 29: blende_2();

    }
}
  
// функция получения типа файла
String getContentType(String filename){
    if(server.hasArg("download")) return "application/octet-stream";
    else if(filename.endsWith(".htm")) return "text/html";
    else if(filename.endsWith(".html")) return "text/html";
    else if(filename.endsWith(".css")) return "text/css";
    else if(filename.endsWith(".js")) return "application/javascript";
    else if(filename.endsWith(".png")) return "image/png";
    else if(filename.endsWith(".gif")) return "image/gif";
    else if(filename.endsWith(".jpg")) return "image/jpeg";
    else if(filename.endsWith(".ico")) return "image/x-icon";
    else if(filename.endsWith(".xml")) return "text/xml";
    else if(filename.endsWith(".pdf")) return "application/x-pdf";
    else if(filename.endsWith(".zip")) return "application/x-zip";
    else if(filename.endsWith(".gz")) return "application/x-gzip";
    return "text/plain";

}

// функция поиска файла в файловой системе
bool handleFileRead(String path){
  #ifdef DEBUG
    Serial.println("handleFileRead: " + path);
  #endif
  if(path.endsWith("/")) path += "index.html";
  if(SPIFFS.exists(path)){
    File file = SPIFFS.open(path, "r");
    size_t sent = server.streamFile(file, getContentType(path));
    file.close();
    return true;
  }
  return false;
  
}

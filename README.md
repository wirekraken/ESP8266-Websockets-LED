# ESP8266 - Websockets - LED strip

#### Control an addressable LED strip with an ESP8266 via a Web browser.
![prev](https://i.ibb.co/fxM5H6V/led-min.jpg)

## Features
 - Adjust the brightness
 - Color change via Color Picker. (Thanks to the [NC22](https://github.com/NC22/HTML5-Color-Picker))
 - Selection of different effects

## Hardware
- ESP8266
- Addressable LED strip (WS2811, WS2812, WS2812B)
- 100 to 500 Ohm resistor (preferably)
- 3.3V to 5V power supply (you can be powered directly from ESP, but the diodes will probably "flicker")

### Wiring diagram
![scheme](https://i.ibb.co/TMm0gJx/esp-ws2812b.png)

## Software
- [Arduino IDE version (1.8.x)](https://www.arduino.cc/en/software)
- [ESP8266FS filesystem uploader](https://github.com/esp8266/arduino-esp8266fs-plugin) (used to upload files to ESP)
- [Websocket library](https://github.com/Links2004/arduinoWebSockets) (available from the library manager)
- [FastLED library](https://github.com/FastLED/FastLED) (available from the library manager)

## Installing
- Connect your ESP to your computer
- Open `ESP8266-LED.ino` and update settings
- Upload a sketch
- In the IDE's top menu, select ***tools*** -> ***ESP8266 Sketch Data Upload*** to download files from the `data` directory.
- Open the serial port monitor (if the connection is successful, IP your ESP will be displayed).
- Open the browser and enter the IP address.
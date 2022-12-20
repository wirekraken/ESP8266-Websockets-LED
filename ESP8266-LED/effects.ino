uint8_t idex = 0;
uint8_t ihue = 0;
uint8_t saturationVal = 255;
uint8_t ibright = 0;
uint16_t TOP_INDEX = uint8_t(NUM_LEDS / 2); // center of the stip
uint8_t EVENODD = NUM_LEDS % 2;
uint8_t bouncedirection = 0; // flag for color_bounce()
int ledsX[NUM_LEDS][3]; // array for storing random pixel values

void updateColor(uint8_t r,uint8_t g,uint8_t b) {
  for (uint8_t i = 0 ; i < NUM_LEDS; i++) {
    leds[i].setRGB(r,g,b);
  }
}

//плавная смена цветов
void rainbow_fade(){ 
  ihue++;
  if(ihue > 255){
    ihue = 0;
  }
  for(int idex = 0 ; idex < NUM_LEDS; idex++ ){
    leds[idex] = CHSV(ihue, saturationVal, 255);
  }
  LEDS.show();
  delay(_delay);
}

// крутящаяся радуга
void rainbow_loop(){ 
  idex++;
  ihue = ihue + _step;
  if(idex >= NUM_LEDS){
    idex = 0;
  }
  if(ihue > 255){
    ihue = 0;
  }
  leds[idex] = CHSV(ihue, saturationVal, 255);
  LEDS.show();
  delay(_delay);
}

// случайная смена цветов
void random_burst(){
  idex = random(0, NUM_LEDS);
  ihue = random(0, 255);
  leds[idex] = CHSV(ihue, saturationVal, 255);
  LEDS.show();
  delay(_delay);
}

// бегающий пиксель
void color_bounce(){
  if(bouncedirection == 0){
    idex = idex + 1;
    if(idex == NUM_LEDS){
      bouncedirection = 1;
      idex = idex - 1;
    }
  }
  if(bouncedirection == 1){
    idex = idex - 1;
    if(idex == 0){
      bouncedirection = 0;
    }
  }
  for(int i = 0; i < NUM_LEDS; i++ ){
    if(i == idex){
      leds[i] = CHSV(_hue, saturationVal, 255);
    }
    else{
      leds[i] = CHSV(0, 0, 0);
    }
  }
  LEDS.show();
  delay(_delay);
}

//бегающий паровозик пикселей
void color_bounceFADE(){
  if(bouncedirection == 0){
    idex = idex + 1;
    if(idex == NUM_LEDS){
      bouncedirection = 1;
      idex = idex - 1;
    }
  }
  if(bouncedirection == 1){
    idex = idex - 1;
    if(idex == 0){
      bouncedirection = 0;
    }
  }
  int iL1 = adjacent_cw(idex);
  int iL2 = adjacent_cw(iL1);
  int iL3 = adjacent_cw(iL2);
  int iR1 = adjacent_ccw(idex);
  int iR2 = adjacent_ccw(iR1);
  int iR3 = adjacent_ccw(iR2);

  for(int i = 0; i < NUM_LEDS; i++ ){
    if(i == idex){
      leds[i] = CHSV(_hue, saturationVal, 255);
    }
    else if(i == iL1){
      leds[i] = CHSV(_hue, saturationVal, 150);
    }
    else if(i == iL2){
      leds[i] = CHSV(_hue, saturationVal, 80);
    }
    else if(i == iL3){
      leds[i] = CHSV(_hue, saturationVal, 20);
    }
    else if(i == iR1){
      leds[i] = CHSV(_hue, saturationVal, 150);
    }
    else if(i == iR2){
      leds[i] = CHSV(_hue, saturationVal, 80);
    }
    else if(i == iR3){
      leds[i] = CHSV(_hue, saturationVal, 20);
    }
    else{
      leds[i] = CHSV(0, 0, 0);
    }
  }
  LEDS.show();
  delay(_delay);
}

// вращение красного и синего
void red_blue_bounce(){
  idex++;
  if(idex >= NUM_LEDS){
    idex = 0;
  }
  int idexR = idex;
  int idexB = antipodal_index(idexR);
  int thathue =(_hue + 160) % 255;

  for(int i = 0; i < NUM_LEDS; i++ ){
    if(i == idexR){
      leds[i] = CHSV(_hue, saturationVal, 255);
    }
    else if(i == idexB){
      leds[i] = CHSV(thathue, saturationVal, 255);
    }
    else{
      leds[i] = CHSV(0, 0, 0);
    }
  }
  LEDS.show();
  delay(_delay);
}

int antipodal_index(int i){
  int iN = i + TOP_INDEX;
  if(i >= TOP_INDEX){
    iN =( i + TOP_INDEX ) % NUM_LEDS;
  }
  return iN;
}

// вращение красного/синего
void rotatingRedBlue(){
  idex++;
  if(idex >= NUM_LEDS){
    idex = 0;
  }
  int idexR = idex;
  int idexB = antipodal_index(idexR);
  int thathue =(_hue + 160) % 255;
  leds[idexR] = CHSV(_hue, saturationVal, 255);
  leds[idexB] = CHSV(thathue, saturationVal, 255);
  LEDS.show();
  delay(_delay);
}

// случайный стробоскоп
void flicker(){
  int random_bright = random(0, 255);
  int random_delay = random(10, 100);
  int random_bool = random(0, random_bright);
  if(random_bool < 10){
    for(int i = 0 ; i < NUM_LEDS; i++ ){
      leds[i] = CHSV(160, 50, random_bright);
    }
    LEDS.show();
    delay(random_delay);
  }
}

// плавная смена яркости
void fade_vertical(){
  idex++;
  if(idex > TOP_INDEX){
    idex = 0;
  }
  int idexA = idex;
  int idexB = horizontal_index(idexA);
  ibright = ibright + 10;
  if(ibright > 255){
    ibright = 0;
  }
  leds[idexA] = CHSV(_hue, saturationVal, ibright);
  leds[idexB] = CHSV(_hue, saturationVal, ibright);
  LEDS.show();
  delay(_delay);
}

//служебная функция
int horizontal_index(int i){
  if(i == 0){
    return 0;
  }
  if(i == TOP_INDEX && EVENODD == 1){
    return TOP_INDEX + 1;
  }
  if(i == TOP_INDEX && EVENODD == 0){
    return TOP_INDEX;
  }
  return NUM_LEDS - i;
}

//служебная функция
void random_red(){
  int temprand;
  for(int i = 0; i < NUM_LEDS; i++ ){
    temprand = random(0, 100);
    if(temprand > 50){
      leds[i].r = 255;
    }
    if(temprand <= 50){
      leds[i].r = 0;
    }
    leds[i].b = 0; leds[i].g = 0;
  }
  LEDS.show();
}

//безумие красных светодиодов
void rule30(){
  if(bouncedirection == 0){
    random_red();
    bouncedirection = 1;
  }
  copy_led_array();
  int iCW;
  int iCCW;
  int y = 100;
  for(int i = 0; i < NUM_LEDS; i++ ){
    iCW = adjacent_cw(i);
    iCCW = adjacent_ccw(i);
    if(ledsX[iCCW][0] > y && ledsX[i][0] > y && ledsX[iCW][0] > y){
      leds[i].r = 0;
    }
    if(ledsX[iCCW][0] > y && ledsX[i][0] > y && ledsX[iCW][0] <= y){
      leds[i].r = 0;
    }
    if(ledsX[iCCW][0] > y && ledsX[i][0] <= y && ledsX[iCW][0] > y){
      leds[i].r = 0;
    }
    if(ledsX[iCCW][0] > y && ledsX[i][0] <= y && ledsX[iCW][0] <= y){
      leds[i].r = 255;
    }
    if(ledsX[iCCW][0] <= y && ledsX[i][0] > y && ledsX[iCW][0] > y){
      leds[i].r = 255;
    }
    if(ledsX[iCCW][0] <= y && ledsX[i][0] > y && ledsX[iCW][0] <= y){
      leds[i].r = 255;
    }
    if(ledsX[iCCW][0] <= y && ledsX[i][0] <= y && ledsX[iCW][0] > y){
      leds[i].r = 255;
    }
    if(ledsX[iCCW][0] <= y && ledsX[i][0] <= y && ledsX[iCW][0] <= y){
      leds[i].r = 0;
    }
  }
  LEDS.show();
  delay(_delay);
}
int adjacent_cw(int i){
  int r;
  if(i < NUM_LEDS - 1){
    r = i + 1;
  }else{
    r = 0;
  }
  return r;
}
int adjacent_ccw(int i){
  int r;
  if(i > 0){
    r = i - 1;
  }
  else{
    r = NUM_LEDS - 1;
  }
  return r;
}

// безумие случайных цветов
void random_march(){
  copy_led_array();
  int iCCW;
  leds[0] = CHSV(random(0, 255), 255, 255);
  for(int idex = 1; idex < NUM_LEDS ; idex++ ){
    iCCW = adjacent_ccw(idex);
    leds[idex].r = ledsX[iCCW][0];
    leds[idex].g = ledsX[iCCW][1];
    leds[idex].b = ledsX[iCCW][2];
  }
  LEDS.show();
  delay(_delay);
}
void copy_led_array(){
  for(int i = 0; i < NUM_LEDS; i++ ){
    ledsX[i][0] = leds[i].r;
    ledsX[i][1] = leds[i].g;
    ledsX[i][2] = leds[i].b;
  }
}

//белый синий красный бегут по кругу
void rwb_march(){ 
  copy_led_array();
  int iCCW;
  idex++;
  if(idex > 2){
    idex = 0;
  }
  switch(idex){
    case 0:
      leds[0].r = 255;
      leds[0].g = 0;
      leds[0].b = 0;
      break;
    case 1:
      leds[0].r = 255;
      leds[0].g = 255;
      leds[0].b = 255;
      break;
    case 2:
      leds[0].r = 0;
      leds[0].g = 0;
      leds[0].b = 255;
      break;
  }
  for(int i = 1; i < NUM_LEDS; i++ ){
    iCCW = adjacent_ccw(i);
    leds[i].r = ledsX[iCCW][0];
    leds[i].g = ledsX[iCCW][1];
    leds[i].b = ledsX[iCCW][2];
  }
  LEDS.show();
  delay(_delay);
}

// эффект пламени
void flame(){
  int idelay = random(0, 35);
  float hmin = 0.1; float hmax = 45.0;
  float hdif = hmax - hmin;
  int randtemp = random(0, 3);
  float hinc =(hdif / float(TOP_INDEX)) + randtemp;
  int ihue = hmin;
  for(int i = 0; i <= TOP_INDEX; i++ ){
    ihue = ihue + hinc;
    leds[i] = CHSV(ihue, saturationVal, 255);
    int ih = horizontal_index(i);
    leds[ih] = CHSV(ihue, saturationVal, 255);
    leds[TOP_INDEX].r = 255; leds[TOP_INDEX].g = 255; leds[TOP_INDEX].b = 255;
    LEDS.show();
    delay(idelay);
  }
}

// радуга
void rainbow_vertical(){ 
  idex++;
  if(idex > TOP_INDEX){
    idex = 0;
  }
  ihue = ihue + _step;
  if(ihue > 255){
    ihue = 0;
  }
  int idexA = idex;
  int idexB = horizontal_index(idexA);
  leds[idexA] = CHSV(ihue, saturationVal, 255);
  leds[idexB] = CHSV(ihue, saturationVal, 255);
  LEDS.show();
  delay(_delay);
}

// безумие случайных вспышек
void random_color_pop(){
  idex = random(0, NUM_LEDS);
  ihue = random(0, 255);
  updateColor(0, 0, 0);
  leds[idex] = CHSV(ihue, saturationVal, 255);
  LEDS.show();
  delay(_delay);
}

// полицейская мигалка 
void policeBlinker(){
  int _hue = 0;
  int thathue =(_hue + 160) % 255;
  for(int x = 0 ; x < 5; x++ ){
    for(int i = 0 ; i < TOP_INDEX; i++ ){
      leds[i] = CHSV(_hue, saturationVal, 255);
    }
    LEDS.show(); delay(_delay);
    updateColor(0, 0, 0);
    LEDS.show(); delay(_delay);
  }
  for(int x = 0 ; x < 5; x++ ){
    for(int i = TOP_INDEX ; i < NUM_LEDS; i++ ){
      leds[i] = CHSV(thathue, saturationVal, 255);
    }
    LEDS.show(); delay(_delay);
    updateColor(0, 0, 0);
    LEDS.show(); delay(_delay);
  }
}

void rgb_propeller(){ // пропеллер
  idex++;
  int ghue =(_hue + 80) % 255;
  int bhue =(_hue + 160) % 255;
  int N3  = int(NUM_LEDS / 3);
  int N6  = int(NUM_LEDS / 6);
  int N12 = int(NUM_LEDS / 12);

  for(int i = 0; i < N3; i++ ){
    int j0 =(idex + i + NUM_LEDS - N12) % NUM_LEDS;
    int j1 =(j0 + N3) % NUM_LEDS;
    int j2 =(j1 + N3) % NUM_LEDS;
    leds[j0] = CHSV(_hue, saturationVal, 255);
    leds[j1] = CHSV(ghue, saturationVal, 255);
    leds[j2] = CHSV(bhue, saturationVal, 255);
  }
  LEDS.show();
  delay(_delay);
}

//случайные вспышки красного
void kitt(){
  int rand = random(0, TOP_INDEX);
  for(int i = 0; i < rand; i++ ){
    leds[TOP_INDEX + i] = CHSV(_hue, saturationVal, 255);
    leds[TOP_INDEX - i] = CHSV(_hue, saturationVal, 255);
    LEDS.show();
    delay(_delay / rand);
  }
  for(int i = rand; i > 0; i-- ){
    leds[TOP_INDEX + i] = CHSV(_hue, saturationVal, 0);
    leds[TOP_INDEX - i] = CHSV(_hue, saturationVal, 0);
    LEDS.show();
    delay(_delay / rand);
  }
}

// зеленые бегают по кругу случайно
void matrix(){
  int rand = random(0, 100);
  if(rand > 90){
    leds[0] = CHSV(_hue, saturationVal, 255);
  }
  else{
    leds[0] = CHSV(_hue, saturationVal, 0);
  }
  copy_led_array();
  for(int i = 1; i < NUM_LEDS; i++ ){
    leds[i].r = ledsX[i - 1][0];
    leds[i].g = ledsX[i - 1][1];
    leds[i].b = ledsX[i - 1][2];
  }
  LEDS.show();
  delay(_delay);
}

// плавная вращающаяся радуга
void new_rainbow_loop(){
  ihue -= 1;
  fill_rainbow( leds, NUM_LEDS, ihue );
  LEDS.show();
  delay(_delay);
}

void setPixel(int Pixel, byte red, byte green, byte blue){
  leds[Pixel].r = red;
  leds[Pixel].g = green;
  leds[Pixel].b = blue;
}
//служебная функция
void setAll(byte red, byte green, byte blue){
  for(int i = 0; i < NUM_LEDS; i++ ){
    setPixel(i, red, green, blue);
  }
  FastLED.show();
}

//линейный огонь
void Fire(int Cooling, int Sparking, int SpeedDelay){
  static byte heat[NUM_LEDS];
  int cooldown;

  for(int i = 0; i < NUM_LEDS; i++){
    cooldown = random(0,((Cooling * 10) / NUM_LEDS) + 2);

    if(cooldown > heat[i]){
      heat[i] = 0;
    } else{
      heat[i] = heat[i] - cooldown;
    }
  }

  for( int k = NUM_LEDS - 1; k >= 2; k--){
    heat[k] =(heat[k - 1] + heat[k - 2] + heat[k - 2]) / 3;
  }

  if( random(255) < Sparking ){
    int y = random(7);
    heat[y] = heat[y] + random(160, 255);
  }

  for( int j = 0; j < NUM_LEDS; j++){
    setPixelHeatColor(j, heat[j] );
  }

  FastLED.show();
  delay(SpeedDelay);
}

void setPixelHeatColor(int Pixel, byte temperature){
  byte t192 = round((temperature / 255.0) * 191);
  byte heatramp = t192 & 0x3F;
  heatramp <<= 2;

  if( t192 > 0x80){
    setPixel(Pixel, 255, 255, heatramp);
  } else if( t192 > 0x40 ){
    setPixel(Pixel, 255, heatramp, 0);
  } else{
    setPixel(Pixel, heatramp, 0, 0);
  }
}

void CenterToOutside(byte red, byte green, byte blue, int EyeSize, int SpeedDelay, int ReturnDelay){
  for(int i =((NUM_LEDS - EyeSize) / 2); i >= 0; i--){
    setAll(0, 0, 0);

    setPixel(i, red / 10, green / 10, blue / 10);
    for(int j = 1; j <= EyeSize; j++){
      setPixel(i + j, red, green, blue);
    }
    setPixel(i + EyeSize + 1, red / 10, green / 10, blue / 10);

    setPixel(NUM_LEDS - i, red / 10, green / 10, blue / 10);
    for(int j = 1; j <= EyeSize; j++){
      setPixel(NUM_LEDS - i - j, red, green, blue);
    }
    setPixel(NUM_LEDS - i - EyeSize - 1, red / 10, green / 10, blue / 10);

    FastLED.show();
    delay(SpeedDelay);
  }
  delay(ReturnDelay);
}

void OutsideToCenter(byte red, byte green, byte blue, int EyeSize, int SpeedDelay, int ReturnDelay){
  for(int i = 0; i <=((NUM_LEDS - EyeSize) / 2); i++){
    setAll(0, 0, 0);

    setPixel(i, red / 10, green / 10, blue / 10);
    for(int j = 1; j <= EyeSize; j++){
      setPixel(i + j, red, green, blue);
    }
    setPixel(i + EyeSize + 1, red / 10, green / 10, blue / 10);

    setPixel(NUM_LEDS - i, red / 10, green / 10, blue / 10);
    for(int j = 1; j <= EyeSize; j++){
      setPixel(NUM_LEDS - i - j, red, green, blue);
    }
    setPixel(NUM_LEDS - i - EyeSize - 1, red / 10, green / 10, blue / 10);

    FastLED.show();
    delay(SpeedDelay);
  }
  delay(ReturnDelay);
}

void LeftToRight(byte red, byte green, byte blue, int EyeSize, int SpeedDelay, int ReturnDelay){
  for(int i = 0; i < NUM_LEDS - EyeSize - 2; i++){
    setAll(0, 0, 0);
    setPixel(i, red / 10, green / 10, blue / 10);
    for(int j = 1; j <= EyeSize; j++){
      setPixel(i + j, red, green, blue);
    }
    setPixel(i + EyeSize + 1, red / 10, green / 10, blue / 10);
    FastLED.show();
    delay(SpeedDelay);
  }
  delay(ReturnDelay);
}

// случайные вспышки белого цвета
void Sparkle(byte red, byte green, byte blue, int SpeedDelay){
  int Pixel = random(NUM_LEDS);
  setPixel(Pixel, red, green, blue);
  FastLED.show();
  delay(SpeedDelay);
  setPixel(Pixel, 0, 0, 0);
}

// бегущие каждые 3 пикселя
void theaterChase(byte red, byte green, byte blue, int SpeedDelay){
  for(int j = 0; j < 10; j++){
    for(int q = 0; q < 3; q++){
      for(int i = 0; i < NUM_LEDS; i = i + 3){
        setPixel(i + q, red, green, blue);
      }
      FastLED.show();
      delay(SpeedDelay);
      for(int i = 0; i < NUM_LEDS; i = i + 3){
        setPixel(i + q, 0, 0, 0);
      }
    }
  }
}

// стробоскопический эффект
void Strobe(byte red, byte green, byte blue, int StrobeCount, int FlashDelay, int EndPause){
  for(int j = 0; j < StrobeCount; j++){
    setAll(red, green, blue);
    FastLED.show();
    delay(FlashDelay);
    setAll(0, 0, 0);
    FastLED.show();
    delay(FlashDelay);
  }

  delay(EndPause);
}

//голубой линейный огонь
void blueFire(int Cooling, int Sparking, int SpeedDelay){
  static byte heat[NUM_LEDS];
  int cooldown;

  for(int i = 0; i < NUM_LEDS; i++){
    cooldown = random(0,((Cooling * 10) / NUM_LEDS) + 2);

    if(cooldown > heat[i]){
      heat[i] = 0;
    } else{
      heat[i] = heat[i] - cooldown;
    }
  }
  for( int k = NUM_LEDS - 1; k >= 2; k--){
    heat[k] =(heat[k - 1] + heat[k - 2] + heat[k - 2]) / 3;
  }
  if( random(255) < Sparking ){
    int y = random(7);
    heat[y] = heat[y] + random(160, 255);
  }
  for( int j = 0; j < NUM_LEDS; j++){
    setPixelHeatColorBlue(j, heat[j] );
  }
  FastLED.show();
  delay(SpeedDelay);
}

void setPixelHeatColorBlue(int Pixel, byte temperature){
  byte t192 = round((temperature / 255.0) * 191);
  byte heatramp = t192 & 0x03;
  heatramp <<= 2;

  if( t192 > 0x03){
    setPixel(Pixel, heatramp,255, 255);
  } else if( t192 > 0x40 ){
    setPixel(Pixel, 255, heatramp, 0);
  } else{
    setPixel(Pixel, 0, 0, heatramp);
  }
}

//расплывающие цвета
void fadeToCenter(){
 static uint8_t hue;
  for(int i = 0; i < NUM_LEDS/2; i++) {   
    leds.fadeToBlackBy(40);
    leds[i] = CHSV(hue++,255,255);
    leds(NUM_LEDS/2,NUM_LEDS-1) = leds(NUM_LEDS/2 - 1 ,0);
    FastLED.delay(33);
  }  
}

//бегающий по кругу паровозик
void runnerChameleon(){
    static uint8_t hue = 0;
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(hue++, 255, 255);
    FastLED.show(); 
     leds[i] = CRGB::Black;
//    fadeall();
    delay(10);
  }
}


void blende(){
    static uint8_t hue = 0;
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(hue++, 255, 255);
    FastLED.show(); 
//     leds[i] = CRGB::Black;
    fadeall();
    delay(10);
  }

  for(int i = (NUM_LEDS)-1; i >= 0; i--) {
    leds[i] = CHSV(hue++, 255, 255);
    FastLED.show();
//     leds[i] = CRGB::Black;
    fadeall();
    delay(10);
  }
}

void blende_2(){
    static uint8_t hue = 0;
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(hue++, 255, 255);
    FastLED.show(); 
    leds[i] = CRGB::Black;
    fadeall();
    delay(10);
  }

  for(int i = (NUM_LEDS)-1; i >= 0; i--) {
    leds[i] = CHSV(hue++, 255, 255);
    FastLED.show();
//     leds[i] = CRGB::Black;
    fadeall();
    delay(10);
  }
}
//служебная функция
void fadeall(){
  for(int i = 0; i < NUM_LEDS; i++) {
    leds[i].nscale8(250); 
  } 
}

#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <string.h>

static const int RXPin = 3, TXPin = 4;
static const int simRXPin = 7, simTXPin = 8;
static const uint32_t GPSBaud = 9600;

static const unsigned long REPORT_INTERVAL = 30; // The interval between updates being sent to the server in seconds

static double longitude = 0;
static double latitude = 0;

static unsigned long lastUpdate = 0;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial gpsSerial(RXPin, TXPin);

//Create software serial object to communicate with SIM800L
SoftwareSerial simSerial(simRXPin, simTXPin); //SIM800L Tx & Rx is connected to Arduino #3 & #2

void setup(){
  Serial.begin(9600);

  //Begin serial communication with Arduino and SIM800L
  simSerial.begin(9600);

  simSetup();
  
  gpsSerial.begin(GPSBaud);
}

void simSetup() {
  Serial.println("Initializing Sim...");
  delay(2000);

  simSerial.println("AT"); //Handshaking with SIM900
  updateSerial();
  simSerial.println("AT+CSQ"); //Signal quality test, value range is 0-31 , 31 is the best
  updateSerial();
  simSerial.println("AT+CCID"); //Read SIM information to confirm whether the SIM is plugged
  updateSerial();
  simSerial.println("AT+CREG?"); //Check whether it has registered in the network
  updateSerial();

  /* Configure bearer profile 1 */
  simSerial.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"");  /* Connection type GPRS */
  updateSerial();
  
  simSerial.println("AT+SAPBR=3,1,\"APN\",\"giffgaff.com\"");  /* APN of the provider */
  updateSerial();
  
  simSerial.println("AT+SAPBR=1,1"); /* Open GPRS context */
  delay(2000);
  updateSerial();
  
  simSerial.println("AT+SAPBR=2,1"); /* Query the GPRS context */
  updateSerial();

  simSerial.println("AT+HTTPINIT");  /* Initialize HTTP service */
  updateSerial();

  simSerial.println("AT+HTTPSSL=1");
  updateSerial();

  simSerial.println("AT+HTTPSSL=?");
  updateSerial();

  simSerial.println("AT+HTTPPARA=\"CID\",1");  /* Set parameters for HTTP session */
  updateSerial();

  simSerial.println("AT+HTTPPARA=\"CONTENT\",\"application/json\"");  /* Set parameters for HTTP session */
  updateSerial();

  simSerial.println("AT+HTTPPARA=\"URL\",\"https://track.mattdavis.info/api/submit-node\"");  /* Set parameters for HTTP session */
  updateSerial();
}

void getGPSLocation() {

  gpsSerial.listen();
//  delay(500);

  // This sketch displays information every time a new sentence is correctly encoded.
  while (gpsSerial.available() > 0){
    gps.encode(gpsSerial.read());
    if (gps.location.isUpdated()){
      latitude = gps.location.lat();
      longitude = gps.location.lng();
      
      Serial.print("Latitude= "); 
      Serial.print(gps.location.lat(), 6);
      Serial.print(" Longitude= ");
      Serial.println(gps.location.lng(), 6);
    }
  }

}

void sendLocation() {

  unsigned long timeDelta = (millis() - lastUpdate) / 1000;

  if (timeDelta >= REPORT_INTERVAL){
    simSerial.listen();
    lastUpdate = millis();
    if (longitude != 0 && latitude != 0)
      sendPost();
  }

}

void sendPost() {
  Serial.println("HTTP post method :");

  String longString = String(longitude, 6);
  String latString = String(latitude, 6);
  String data = "{\"deviceID\": \"YRiehYTv7HziRKr88wCfSFX97d8DuEn6ehDNTKbJAslSqdbbfv4sN750s7y4ZNjh\", \"longitude\": " + longString + ", \"latitude\": " + latString + "}";

  String length = String(data.length());

  simSerial.println("AT+HTTPDATA=" + length + ",10000"); /* POST data of size 127 Bytes with maximum latency time of 10seconds for inputting the data*/
  updateSerial();
  
  simSerial.println(data); /* Data to be sent */
  updateSerial();
  
  simSerial.println("AT+HTTPACTION=1");  /* Start POST session */
//  delay(2000);
  updateSerial();

//  simSerial.println("AT+HTTPTERM");  /* Terminate HTTP service */
//  updateSerial();
  
//  simSerial.println("AT+SAPBR=0,1"); /* Close GPRS context */
//  updateSerial();
}

void loop(){
  getGPSLocation();
  sendLocation();
}

void updateSerial()
{
  delay(500);
  while (Serial.available())
  {
    simSerial.write(Serial.read());//Forward what Serial received to Software Serial Port
  }
  while(simSerial.available()) 
  {
    Serial.write(simSerial.read());//Forward what Software Serial received to Serial Port
  }
}

#include <TinyGPS++.h>
#include <SoftwareSerial.h>

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
  delay(1000);

  simSerial.println("AT"); //Handshaking with SIM900
  updateSerial();
  simSerial.println("AT+CSQ"); //Signal quality test, value range is 0-31 , 31 is the best
  updateSerial();
  simSerial.println("AT+CCID"); //Read SIM information to confirm whether the SIM is plugged
  updateSerial();
  simSerial.println("AT+CREG?"); //Check whether it has registered in the network
  updateSerial();
}

void getGPSLocation() {

//  gpsSerial.listen();
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
    lastUpdate = millis();
    simSerial.println("AT+CMGF=1"); // Configuring TEXT mode
    updateSerial();
    simSerial.println("AT+CMGS=\"+ZZXXXXXXXXXX\"");//change ZZ with country code and xxxxxxxxxxx with phone number to sms
    updateSerial();
    simSerial.print("Longitude = "); //text content
    simSerial.println(longitude, 6);
    simSerial.print("Latitude = ");
    simSerial.println(latitude, 6);
    updateSerial();
    simSerial.write(26);
  }

}

void loop(){
  getGPSLocation();
//  sendLocation();
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

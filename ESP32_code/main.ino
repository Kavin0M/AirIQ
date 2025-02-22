#include <MQ135.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <Firebase_ESP_Client.h>
#include <WiFi.h>
#include "time.h"

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define MQ135_PIN 34

// Firebase RTDB credentials
#define WIFI_SSID "HBL"
#define WIFI_PASSWORD "HBL123456"

#define API_KEY "AIzaSyAfD4F9a-9BXpy4VPqIcLIetQjLvD0yrnQ"
#define DATABASE_URL "https://airiq-7c670-default-rtdb.asia-southeast1.firebasedatabase.app/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

// Sensor initialization
MQ135 mq135_sensor(MQ135_PIN);
Adafruit_BME280 bme;

float Ro = 10.0;

float getGasPPM(float ppm_co2, float A, float B)
{
    return A * pow(ppm_co2 / 400.0, B); // Normalize using 400 PPM CO2 baseline
}

// NTP server for time sync
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800; // GMT+5:30
const int daylightOffset_sec = 0;

void setup()
{
    Serial.begin(115200);

    // Connect to Wi-Fi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }
    Serial.println("\nConnected with IP: " + WiFi.localIP().toString());

    // Firebase setup
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    config.token_status_callback = tokenStatusCallback;

    if (Firebase.signUp(&config, &auth, "", ""))
    {
        Serial.println("Firebase signup successful");
        signupOK = true;
    }
    else
    {
        Serial.printf("Firebase signup error: %s\n", config.signer.signupError.message.c_str());
    }

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    if (!bme.begin(0x76))
    {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
        while (1)
            ;
    }

    // Sync time with NTP
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop()
{
    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
    {
        sendDataPrevMillis = millis();

        // Read data from MQ135
        float co2_ppm = mq135_sensor.getPPM();
        float nh3_ppm = getGasPPM(co2_ppm, 102.2, -2.473);
        float alcohol_ppm = getGasPPM(co2_ppm, 300.0, -1.9);
        float benzene_ppm = getGasPPM(co2_ppm, 601.75, -3.59);
        float no2_ppm = getGasPPM(co2_ppm, 200.0, -3.0);

        // Read BME280 data
        float temperature = bme.readTemperature();
        float pressure = bme.readPressure() / 100.0F;
        float humidity = bme.readHumidity();

        // Get the current time
        struct tm timeinfo;
        if (!getLocalTime(&timeinfo))
        {
            Serial.println("Failed to obtain time");
            return;
        }

        // Format timestamp as "YYYY-MM-DD HH:MM:SS"
        char timestamp[25];
        snprintf(timestamp, sizeof(timestamp), "%04d-%02d-%02d %02d:%02d:%02d",
                 timeinfo.tm_year + 1900, timeinfo.tm_mon + 1, timeinfo.tm_mday,
                 timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);

        Serial.print("Current Time: ");
        Serial.println(timestamp);

        // Print sensor data
        Serial.print("CO2 PPM: ");
        Serial.println(co2_ppm);
        Serial.print("NH3 PPM: ");
        Serial.println(nh3_ppm);
        Serial.print("Alcohol PPM: ");
        Serial.println(alcohol_ppm);
        Serial.print("Benzene PPM: ");
        Serial.println(benzene_ppm);
        Serial.print("NO2 PPM: ");
        Serial.println(no2_ppm);
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.println(" °C");
        Serial.print("Pressure: ");
        Serial.print(pressure);
        Serial.println(" hPa");
        Serial.print("Humidity: ");
        Serial.print(humidity);
        Serial.println(" %");

        // Prepare JSON data for Firebase
        FirebaseJson json;
        json.set("uid", "000001")
        json.set("timestamp", timestamp);
        json.set("co2_ppm", co2_ppm);
        json.set("nh3_ppm", nh3_ppm);
        json.set("alcohol_ppm", alcohol_ppm);
        json.set("benzene_ppm", benzene_ppm);
        json.set("no2_ppm", no2_ppm);
        json.set("temperature", temperature);
        json.set("pressure", pressure);
        json.set("humidity", humidity);

        // Send data to Firebase
        if (Firebase.RTDB.setJSON(&fbdo, "/sensorData", &json))
        {
            Serial.println("Data sent to Firebase successfully");
        }
        else
        {
            Serial.print("Firebase setJSON failed: ");
            Serial.println(fbdo.errorReason());
        }
    }

    delay(2000);
}

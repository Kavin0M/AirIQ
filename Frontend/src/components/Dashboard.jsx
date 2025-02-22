import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  BeakerIcon,
  RefreshCcw,
  Signal
} from "lucide-react";

// Utility functions for determining quality colors and status
const getQualityColor = (value, type) => {
  switch(type) {
    case 'temperature':
      if (value < 22) return { text: 'text-[#007BFF]', bg: 'bg-[#007BFF]' };
      if (value < 30) return { text: 'text-green-500', bg: 'bg-green-500' };
      if (value < 40) return { text: 'text-yellow-500', bg: 'bg-yellow-500' };
      return { text: 'text-red-500', bg: 'bg-red-500' };
    case 'humidity':
      if (value < 30) return { text: 'text-red-500', bg: 'bg-red-500' };
      if (value < 60) return { text: 'text-green-500', bg: 'bg-green-500' };
      return { text: 'text-yellow-500', bg: 'bg-yellow-500' };
    case 'co2':
      if (value < 800) return { text: 'text-green-500', bg: 'bg-green-500' };
      if (value < 1000) return { text: 'text-yellow-500', bg: 'bg-yellow-500' };
      return { text: 'text-red-500', bg: 'bg-red-500' };
    default:
      return { text: 'text-gray-500', bg: 'bg-gray-500' };
  }
};

const getQualityStatus = (value, type) => {
  switch(type) {
    case 'temperature':
      if (value < 18) return 'Cold';
      if (value < 25) return 'Optimal';
      if (value < 30) return 'Warm';
      return 'Hot';
    case 'humidity':
      if (value < 30) return 'Dry';
      if (value < 60) return 'Comfortable';
      return 'Humid';
    case 'co2':
      if (value < 800) return 'Excellent';
      if (value < 1000) return 'Acceptable';
      return 'Poor';
    default:
      return 'Normal';
  }
};

// Device Card Component
const DeviceCard = ({ device, isSelected, onSelect }) => {
  const lastReading = device.latestData;
  const colors = getQualityColor(lastReading.temperature, 'temperature');
  const status = getQualityStatus(lastReading.temperature, 'temperature');

  return (
    <div 
      onClick={onSelect}
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
        isSelected ? 'border-2 border-[#007BFF]' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg bg-[#007BFF] bg-opacity-10`}>
            <Signal className="h-6 w-6 text-[#007BFF]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.location}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${colors.text} bg-opacity-10`}>
          {status}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">Temperature</div>
          <div className="font-semibold">{lastReading.temperature.toFixed(1)}°C</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Humidity</div>
          <div className="font-semibold">{lastReading.humidity.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">CO2</div>
          <div className="font-semibold">{lastReading.co2_ppm.toFixed(0)} PPM</div>
        </div>
      </div>
    </div>
  );
};

// Interactive Gauge Component
const InteractiveGauge = ({ value, maxValue, title, type, icon: Icon }) => {
  const colors = getQualityColor(value, type);
  const status = getQualityStatus(value, type);
  
  const normalizedValue = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colors.text} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${colors.text}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.text} bg-opacity-10`}>
          {status}
        </span>
      </div>

      <div className="relative pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-3xl font-bold">{value.toFixed(1)}</span>
          <span className="text-gray-500 self-end">{maxValue}</span>
        </div>
        
        <div className="h-3 bg-gray-100 rounded-full">
          <div 
            className={`h-full transition-all duration-500 ease-out rounded-full ${colors.bg} opacity-80`}
            style={{ width: `${normalizedValue}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>{maxValue/2}</span>
          <span>{maxValue}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
    const [devices, setDevices] = useState([
        {
          id: 1,
          name: "Lab Sensor 1",
          location: "Main Laboratory",
          latestData: {
            temperature: 23.5,
            humidity: 45,
            co2_ppm: 650,
            no2_ppm: 3.2,
            benzene_ppm: 5.1,
            pressure: 998,
            uid: "LAB001"
          }
        },    
    {
      id: 2,
      name: "Office Sensor",
      location: "Main Office",
      latestData: {
        temperature: 22.0,
        humidity: 50,
        co2_ppm: 700,
        no2_ppm: 2.5,
        benzene_ppm: 4.0,
        pressure: 1000,
        uid: "sample01"
      }
    },
    {
      id: 3,
      name: "Storage Sensor",
      location: "Storage Room",
      latestData: {
        temperature: 20.0,
        humidity: 55,
        co2_ppm: 600,
        no2_ppm: 2.0,
        benzene_ppm: 3.5,
        pressure: 1002,
        uid: "Sample02"
      }
    }
  ]);
  
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateFirstDevice = (apiData) => {
    if (!apiData) return;

    setDevices(prevDevices => [
      {
        ...prevDevices[0],
        latestData: {
          temperature: Number(apiData.temperature) || prevDevices[0].latestData.temperature,
          humidity: Number(apiData.humidity) || prevDevices[0].latestData.humidity,
          co2_ppm: Number(apiData.co2_ppm) || prevDevices[0].latestData.co2_ppm,
          no2_ppm: Number(apiData.no2_ppm) || prevDevices[0].latestData.no2_ppm,
          benzene_ppm: Number(apiData.benzene_ppm) || prevDevices[0].latestData.benzene_ppm,
          pressure: Number(apiData.pressure) || prevDevices[0].latestData.pressure,
          uid: apiData.uid || prevDevices[0].latestData.uid
        }
      },
      ...prevDevices.slice(1)
    ]);
    
    // Update the last update timestamp
    setLastUpdate(new Date());
    
    // If this device is currently selected, update the selection
    if (selectedDevice?.id === 1) {
      setSelectedDevice(prevSelected => ({
        ...prevSelected,
        latestData: {
          temperature: Number(apiData.temperature) || prevSelected.latestData.temperature,
          humidity: Number(apiData.humidity) || prevSelected.latestData.humidity,
          co2_ppm: Number(apiData.co2_ppm) || prevSelected.latestData.co2_ppm,
          no2_ppm: Number(apiData.no2_ppm) || prevSelected.latestData.no2_ppm,
          benzene_ppm: Number(apiData.benzene_ppm) || prevSelected.latestData.benzene_ppm,
          pressure: Number(apiData.pressure) || prevSelected.latestData.pressure,
          uid: apiData.uid || prevSelected.latestData.uid
        }
      }));
    }
  };


  useEffect(() => {
    setIsLoading(true);
    const eventSource = new EventSource("http://localhost:8000/realtime-sensor-data/");
  
    eventSource.onopen = () => {
      setConnectionStatus('connected');
      setIsLoading(false);
      setError(null);
    };
  
    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log(newData);
        if (!newData || !newData.latest_data) {
          throw new Error('Invalid data format received');
        }
  
        // Get the first sensor ID (assuming there's only one sensor for now)
        const sensorId = Object.keys(newData.latest_data)[0]; // e.g., "AIQ_A3F4C8"
        const sensorData = newData.latest_data[sensorId];
  
        if (!sensorData) {
          throw new Error('No sensor data available');
        }
  
        // Update the first device with new data
        setDevices(prevDevices => [
          {
            ...prevDevices[0],
            latestData: {
              temperature: Number(sensorData.temperature) || prevDevices[0].latestData.temperature,
              humidity: Number(sensorData.humidity) || prevDevices[0].latestData.humidity,
              co2_ppm: Number(sensorData.co2_ppm)*0.1 || prevDevices[0].latestData.co2_ppm,
              no2_ppm: Number(sensorData.no2_ppm) || prevDevices[0].latestData.no2_ppm,
              benzene_ppm: Number(sensorData.benzene_ppm) || prevDevices[0].latestData.benzene_ppm,
              pressure: Number(sensorData.pressure) || prevDevices[0].latestData.pressure,
              // Add new fields
              alcohol_ppm: Number(sensorData.alcohol_ppm) || 0,
              nh3_ppm: Number(sensorData.nh3_ppm) || 0,
              timestamp: sensorData.timestamp,
              uid: sensorId
            }
          },
          ...prevDevices.slice(1)
        ]);
  
        // Update selected device if it's the first device
        setSelectedDevice(prevSelected => {
          if (prevSelected?.id === 1) {
            return {
              ...prevSelected,
              latestData: {
                temperature: Number(sensorData.temperature) || prevSelected.latestData.temperature,
                humidity: Number(sensorData.humidity) || prevSelected.latestData.humidity,
                co2_ppm: Number(sensorData.co2_ppm)*0.1 || prevSelected.latestData.co2_ppm,
                no2_ppm: Number(sensorData.no2_ppm) || prevSelected.latestData.no2_ppm,
                benzene_ppm: Number(sensorData.benzene_ppm) || prevSelected.latestData.benzene_ppm,
                pressure: Number(sensorData.pressure) || prevSelected.latestData.pressure,
                // Add new fields
                alcohol_ppm: Number(sensorData.alcohol_ppm) || 0,
                nh3_ppm: Number(sensorData.nh3_ppm) || 0,
                timestamp: sensorData.timestamp,
                uid: sensorId
              }
            };
          }
          return prevSelected;
        });
  
        setLastUpdate(new Date(sensorData.timestamp));
        setError(null);
      } catch (err) {
        console.error('Error processing sensor data:', err);
        setError('Error processing sensor data: ' + err.message);
      }
    };
  
    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setConnectionStatus('disconnected');
      setError('Connection error. Attempting to reconnect...');
      setIsLoading(true);
    };
  
    return () => {
      eventSource.close();
    };
  }, []);

  // Add loading and error indicators
  const renderStatus = () => {
    if (isLoading) {
      return (
        <div className="bg-blue-50 text-blue-700 rounded-lg px-4 py-2 flex items-center">
          <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
          Updating...
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 text-red-700 rounded-lg px-4 py-2">
          {error}
        </div>
      );
    }
    return (
      <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center">
        <RefreshCcw className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </span>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Environmental Monitoring</h1>
            <p className="text-gray-500 mt-1">Multi-device sensor analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-md flex items-center">
              <RefreshCcw className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {devices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              isSelected={selectedDevice?.id === device.id}
              onSelect={() => setSelectedDevice(device)}
            />
          ))}
        </div>

        {/* Selected Device Details */}
        {selectedDevice && (
          <div className="mt-8">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDevice.name} Details</h2>
              <span className="ml-4 px-4 py-1 bg-[#17A2B8] text-white rounded-full text-sm">
                {selectedDevice.latestData.uid}
              </span>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InteractiveGauge 
                value={selectedDevice.latestData.temperature}
                maxValue={50}
                title="Temperature"
                type="temperature"
                icon={Thermometer}
              />
              <InteractiveGauge 
                value={selectedDevice.latestData.humidity}
                maxValue={100}
                title="Humidity"
                type="humidity"
                icon={Droplets}
              />
              <InteractiveGauge 
                value={selectedDevice.latestData.co2_ppm}
                maxValue={2000}
                title="CO2 Level"
                type="co2"
                icon={Cloud}
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Wind className="h-5 w-5 text-[#007BFF]" />
                  <h3 className="text-lg font-semibold">NO2 Levels</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {selectedDevice.latestData.no2_ppm.toFixed(3)} <span className="text-sm text-gray-500">PPM</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BeakerIcon className="h-5 w-5 text-[#007BFF]" />
                  <h3 className="text-lg font-semibold">Benzene</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {selectedDevice.latestData.benzene_ppm.toFixed(3)} <span className="text-sm text-gray-500">PPM</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Activity className="h-5 w-5 text-[#007BFF]" />
                  <h3 className="text-lg font-semibold">Pressure</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {selectedDevice.latestData.pressure.toFixed(0)} <span className="text-sm text-gray-500">hPa</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
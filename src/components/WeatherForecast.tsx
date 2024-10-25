import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';
import { useWeather } from '../hooks/useWeather';

interface WeatherForecastProps {
  latitude: number;
  longitude: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ latitude, longitude }) => {
  const { weather, loading, error } = useWeather(latitude, longitude);

  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-4">
        <p>Kunne ikke laste værdata: {error}</p>
      </div>
    );
  }

  const getWeatherIcon = (symbolCode: string) => {
    if (symbolCode.includes('rain')) return <CloudRain className="w-6 h-6" />;
    if (symbolCode.includes('snow')) return <CloudSnow className="w-6 h-6" />;
    if (symbolCode.includes('cloud')) return <Cloud className="w-6 h-6" />;
    if (symbolCode.includes('wind')) return <Wind className="w-6 h-6" />;
    return <Sun className="w-6 h-6" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Værvarsel</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {weather.slice(0, 8).map((hour, index) => {
          const time = new Date(hour.time).toLocaleTimeString('nb-NO', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div 
              key={index}
              className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {time}
              </span>
              {getWeatherIcon(hour.symbolCode)}
              <span className="text-lg font-semibold mt-2">
                {Math.round(hour.temperature)}°C
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                <div>{Math.round(hour.windSpeed)} m/s</div>
                <div>{hour.precipitation} mm</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
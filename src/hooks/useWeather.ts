import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  symbolCode: string;
  time: string;
}

export function useWeather(latitude: number, longitude: number) {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Use the Netlify function endpoint
        const response = await fetch(`/.netlify/functions/weather?lat=${latitude}&lon=${longitude}`);

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        const next24Hours = data.properties.timeseries
          .slice(0, 24)
          .map((item: any) => ({
            temperature: item.data.instant.details.air_temperature,
            windSpeed: item.data.instant.details.wind_speed,
            windDirection: item.data.instant.details.wind_direction,
            precipitation: item.data.next_1_hours?.details.precipitation_amount ?? 0,
            symbolCode: item.data.next_1_hours?.summary.symbol_code ?? 'unknown',
            time: item.time
          }));

        setWeather(next24Hours);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error };
}
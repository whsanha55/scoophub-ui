export interface WeatherData {
  id: number;
  location: string;
  fetched_at: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  condition: string;
  precip_mm: number;
  rain_chance: number;
  pm10: number;
  pm10_grade: string;
  pm25: number;
  pm25_grade: string;
  ozone: number;
  uv_index: number;
  uv_grade: string;
  weekly_forecast: DailyForecast[];
  raw_json: Record<string, unknown>;
}

export interface DailyForecast {
  date: string;
  max_temp: number;
  min_temp: number;
  condition: string;
  rain_chance: number;
}

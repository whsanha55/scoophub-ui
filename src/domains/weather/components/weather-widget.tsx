"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Wind, Thermometer, Sun, Eye } from "lucide-react";
import type { WeatherData } from "../types";

interface WeatherWidgetProps {
  weather: WeatherData;
  compact?: boolean;
}

function uvEmoji(grade: string): string {
  const g = grade.toLowerCase();
  if (g.includes("low")) return "낮음";
  if (g.includes("moderate")) return "보통";
  if (g.includes("high")) return "높음";
  if (g.includes("very")) return "매우 높음";
  return grade;
}

function pmGrade(grade: string): "default" | "secondary" | "destructive" | "outline" {
  const g = grade.toLowerCase();
  if (g.includes("good")) return "secondary";
  if (g.includes("moderate")) return "default";
  return "destructive";
}

export function WeatherWidget({ weather, compact = false }: WeatherWidgetProps) {
  if (compact) {
    return (
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-4">
          <Cloud className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-2xl font-bold">{weather.temperature.toFixed(1)}°C</p>
            <p className="text-xs text-muted-foreground">{weather.condition}</p>
          </div>
          <div className="ml-auto text-right text-xs text-muted-foreground">
            <p>체감 {weather.feels_like.toFixed(1)}°C</p>
            <p>습도 {weather.humidity}%</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          {weather.location} 날씨
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold">{weather.temperature.toFixed(1)}°C</span>
            <div className="text-sm text-muted-foreground">
              <p>{weather.condition}</p>
              <p>체감 {weather.feels_like.toFixed(1)}°C</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>습도 {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span>{weather.wind_direction} {weather.wind_speed}m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <span>강수 {weather.precip_mm}mm</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-400" />
            <span>강수확률 {weather.rain_chance}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span>UV {weather.uv_index} ({uvEmoji(weather.uv_grade)})</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <span>오존 {weather.ozone}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant={pmGrade(weather.pm10_grade)}>
            PM10 {weather.pm10} ({weather.pm10_grade})
          </Badge>
          <Badge variant={pmGrade(weather.pm25_grade)}>
            PM2.5 {weather.pm25} ({weather.pm25_grade})
          </Badge>
        </div>
        {weather.weekly_forecast && weather.weekly_forecast.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">주간 예보</p>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-7">
              {weather.weekly_forecast.map((day) => (
                <div key={day.date} className="text-center text-xs p-2 rounded-lg bg-muted/50">
                  <p className="font-medium">{day.date.slice(5)}</p>
                  <p>{day.condition}</p>
                  <p>{day.min_temp}°/{day.max_temp}°</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

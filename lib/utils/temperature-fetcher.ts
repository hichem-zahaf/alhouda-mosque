/**
 * Temperature fetching utility
 */

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity?: number;
  location: string;
  icon?: string;
}

export interface TemperatureDisplayOptions {
  unit: 'celsius' | 'fahrenheit';
  showIcon?: boolean;
  showCondition?: boolean;
}

/**
 * Fetch temperature from Open-Meteo API (free, no API key required)
 */
export async function fetchTemperature(
  latitude: number,
  longitude: number,
  unit: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherData> {
  try {
    const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=${tempUnit}&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    return {
      temperature: Math.round(current.temperature_2m),
      condition: getWeatherCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      location: '',
    };
  } catch (error) {
    console.error('Failed to fetch temperature:', error);
    // Return default values on error
    return {
      temperature: 0,
      condition: 'غير متوفر',
      location: '',
    };
  }
}

/**
 * Get weather condition description from WMO code
 */
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'صافي',
    1: 'غائم جزئياً',
    2: 'غائم جزئياً',
    3: 'غائم',
    45: 'ضباب',
    48: 'ضباب متجمد',
    51: 'رذاذ خفيف',
    53: 'رذاذ معتدل',
    55: 'رذاذ كثيف',
    61: 'مطر خفيف',
    63: 'مطر معتدل',
    65: 'مطر غزير',
    71: 'ثلج خفيف',
    73: 'ثلج معتدل',
    75: 'ثلج غزير',
    80: 'زخات مطر خفيفة',
    81: 'زخات مطر معتدلة',
    82: 'زخات مطر غزيرة',
    95: 'عاصفة رعدية',
    96: 'عاصفة رعدية مع برد',
    99: 'عاصفة رعدية قوية',
  };

  return conditions[code] || 'غير معروف';
}

/**
 * Format temperature for display
 */
export function formatTemperature(
  data: WeatherData,
  options: Partial<TemperatureDisplayOptions> = {}
): string {
  const { unit = 'celsius' } = options;
  const symbol = unit === 'celsius' ? '°C' : '°F';

  if (data.temperature === 0 && data.condition === 'غير متوفر') {
    return '--';
  }

  return `${data.temperature}${symbol}`;
}

/**
 * Format temperature with Arabic numerals
 */
export function formatArabicTemperature(
  data: WeatherData,
  options: Partial<TemperatureDisplayOptions> = {}
): string {
  const temp = formatTemperature(data, options);

  if (temp === '--') {
    return '--';
  }

  // Convert numbers to Arabic numerals
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return temp.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

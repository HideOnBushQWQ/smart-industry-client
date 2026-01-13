import type { ApiResponse } from './common';

/**
 * Single sensor latest data item.
 */
export interface SensorLatestItem {
  id: string;
  name: string;
  unit: string;
  data: number;
}

/**
 * Latest sensor data payload.
 */
export interface SensorLatestData {
  sensorList: SensorLatestItem[];
}

/**
 * Latest sensor API response.
 */
export type SensorLatestResponse = ApiResponse<SensorLatestData>;

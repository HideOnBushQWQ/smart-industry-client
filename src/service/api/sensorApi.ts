import { selfRequest } from '@/service/request';
import type { SensorLatestData } from '@/types/api/sensor';

export function fetchLatestSensors() {
  return selfRequest<SensorLatestData>({
    url: '/sensors/latest',
    method: 'get'
  });
}

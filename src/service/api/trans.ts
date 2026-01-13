import type { SensorLatestTransData, SensorPredTransData } from '@/types/api/trans';
import { selfRequest } from '../request';

export function fetchLatestTrans() {
  return selfRequest<SensorLatestTransData>({
    url: '/trans/latest',
    method: 'get'
  });
}

export function fetchPredTrans() {
  return selfRequest<SensorPredTransData>({
    url: '/trans/predict',
    method: 'get'
  });
}

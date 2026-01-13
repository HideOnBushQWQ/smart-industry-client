import { selfRequest } from '../request';

export function fetchMockSystemStatus(): Promise<Api.Mock.SystemStatus> {
  return selfRequest({
    url: `/mock/system/status`,
    method: 'get'
  });
}

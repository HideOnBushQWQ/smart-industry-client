declare namespace Api {
  /**
   * namespace Mock
   *
   * local mock api module
   */
  namespace Mock {
    interface SystemStatus {
      status: 'ok' | 'degraded';
      serverTime: string;
      uptimeSeconds: number;
      activeUsers: number;
    }
  }
}

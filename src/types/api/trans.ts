export interface SensorLatestTransItem {
  detectTime: string;
  trans: number;
}

export interface SensorLatestTransData {
  latestTrans: SensorLatestTransItem[];
}

export interface BeforeTransItem {
  predTrans: number;
  actualTrans: number;
  detectTime: string;
}

export interface AfterTransItem {
  predTrans: number;
  predTime: string;
}

export interface SensorPredTransData {
  predTransData: {
    before: BeforeTransItem[];
    after: AfterTransItem[];
  };
}

/**
 * Actual history data for chart display
 */
export interface ActualHistory {
  ts: string[];
  conc: number[];
  trans: number[];
}

/**
 * Prediction response data for chart display
 */
export interface PredictResp {
  ts: string[];
  conc: number[];
  trans: number[];
}

/**
 * Advice item for optimization suggestions
 */
export interface AdviceItem {
  sensorId: string;
  sensorName: string;
  suggestValue: number;
  predictedConc: number;
  predictedTrans: number;
}

export type SensorReading = { id: string; name: string; value: number; unit: string };

export type PredictResp = {
  ts: string[]; // 时间轴
  conc: number[]; // 浓度预测 y_hat
  trans: number[]; // 透光率预测 y_hat
};

export type AdviceItem = {
  sensorId: string;
  sensorName: string;
  suggestValue: number;
  predictedConc: number;
  predictedTrans: number;
};
export type ActualHistory = {
  ts: string[];
  conc: number[];
  trans: number[];
};

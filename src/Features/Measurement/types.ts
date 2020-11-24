export type IProps = {
  metrics: Array<Metric>;
};

export type Metric = {
  metricName: string;
  after: number;
};

export type Measurement = {
  metric: string;
  measurements: Array<{
    value: number;
    at: number;
    metric: string;
  }>;
};

export type CardProps = {
  measurement: {
    name: string;
    value: number;
  };
};

export type ApiErrorAction = {
  error: string;
};

export type KeyValue = {
  name: string;
  value: number;
};

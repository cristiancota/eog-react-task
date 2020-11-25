import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import { ApiErrorAction, KeyValue, Measurement, Metric } from './types';

const initialState = {
  availableMetrics: [] as Array<string>,
  measurements: [] as Array<{}>,
  heartBeat: Date.now() as number,
  selectedMetrics: [] as Array<Metric>,
  lastMeasurements: [] as Array<KeyValue>,
};

const slice = createSlice({
  name: 'measurement',
  initialState,
  reducers: {
    setAvailableMetrics: (state, action: PayloadAction<Array<string>>) => {
      state.availableMetrics = action.payload;
    },
    setSelectedMetrics: (state, action: PayloadAction<Array<Metric>>) => {
      state.selectedMetrics = action.payload.map(metric => {
        return { metricName: metric.metricName, after: state.heartBeat - 2000000 };
      });
    },
    setHeartBeat: (state, action: PayloadAction<number>) => {
      state.heartBeat = action.payload;
    },
    measurementDataRecevied: (state, action: PayloadAction<Array<Measurement>>) => {
      state.lastMeasurements = action.payload.map(measurement => {
        return {
          name: measurement.metric,
          value: measurement.measurements[measurement.measurements.length - 1].value,
        };
      });

      const trimmed = action.payload.map(measurement => {
        return {
          metric: measurement.metric,
          measurements: measurement.measurements.slice(measurement.measurements.length - 1400),
        };
      });

      const hashMap = new Map();

      trimmed.forEach(trimm => {
        trimm.measurements.forEach(measurement => {
          if (!hashMap.get(measurement.at)) {
            hashMap.set(measurement.at, {
              [measurement.metric]: measurement.value,
            });
          } else {
            hashMap.set(measurement.at, {
              ...hashMap.get(measurement.at),
              [measurement.metric]: measurement.value,
            });
          }
        });
      });

      let dataSet = [] as Array<{}>;

      hashMap.forEach((value, key) => {
        dataSet.push({ ...value, name: key });
      });

      state.measurements = dataSet;
    },
    measurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

export const measurementSelector = (state: IState) => state.measurement.measurements;
export const lastMeasurementSelector = (state: IState) => state.measurement.lastMeasurements;
export const selectedMetricsSelector = (state: IState) => state.measurement.selectedMetrics;
export const availableMetricsSelector = (state: IState) => state.measurement.availableMetrics;

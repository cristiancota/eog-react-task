import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import { Measurement, Metric } from './types';

const initialState = {
  measurements: [] as Array<{}>,
  selectedMetrics: [] as Array<Metric>,
  lastMeasurements: [] as Array<{
    name: string;
    value: number;
  }>,
};

export type ApiErrorAction = {
  error: string;
};

const slice = createSlice({
  name: 'measurement',
  initialState,
  reducers: {
    setSelectedMetrics: (state, action: PayloadAction<Array<Metric>>) => {
      state.selectedMetrics = action.payload.map(metric => {
        return { metricName: metric.metricName, after: metric.after };
      });
    },
    measurementDataRecevied: (state, action: PayloadAction<Array<Measurement>>) => {
      state.lastMeasurements = action.payload.map(measurement => {
        return {
          name: measurement.metric,
          value: measurement.measurements[measurement.measurements.length - 1].value,
        };
      });

      const hashMap = new Map();

      action.payload.forEach(trimm => {
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
export const selectedMetrics = (state: IState) => state.measurement.selectedMetrics;

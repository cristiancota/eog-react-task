import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  metric: string;
  measurements: Array<{
    value: number;
    at: number;
    metric: string;
  }>;
};

// TODO don't repeat
interface Metric {
  metricName: string;
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  measurements: [] as Array<{}>,
  selectedMetrics: [] as Array<Metric>,
};

const slice = createSlice({
  name: 'measurement',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<Array<string>>) => {
      state.selectedMetrics = action.payload.map(metric => {
        return { metricName: metric };
      });
    },
    measurementDataRecevied: (state, action: PayloadAction<Array<Measurement>>) => {
      const trimmed = action.payload.map(measurement => {
        return {
          metric: measurement.metric,
          measurements: measurement.measurements.slice(0, 1384),
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

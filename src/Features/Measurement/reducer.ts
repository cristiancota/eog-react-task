import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  metric: string;
  measurements: Array<{
    value: number;
  }>;
};

// TODO don't repeat
interface Metric {
  metricName: String;
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  measurements: [] as Array<Measurement>,
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
      state.measurements = action.payload.map(measurement => {
        return {
          metric: measurement.metric,
          measurements: measurement.measurements.slice(0, 10),
        };
      });
    },
    measurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;

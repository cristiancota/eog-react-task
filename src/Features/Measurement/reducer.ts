import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  metric: string;
  measurements: Array<{
    value: number
  }>;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  measurements: [] as Array<Measurement>,
};

const slice = createSlice({
  name: 'measurement',
  initialState,
  reducers: {
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

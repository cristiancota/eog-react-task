import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, Provider, useQuery } from 'urql';
import SelectMetric from '../../components/SelectMetric';
import { IState } from '../../store';
import { actions } from './reducer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const query = `
query($metrics: [MeasurementQuery]!) {
  getMultipleMeasurements(input: $metrics) {
    metric
    measurements {
      metric
      value
      at
    }
  }
}
`;

interface Metric {
  metricName: String;
}

interface IProps {
  metrics: Array<Metric>;
}

const client = createClient({
  // move to constants file
  url: 'https://react.eogresources.com/graphql',
});

const getMetrics = (state: IState) => {
  // move to reducer
  return state.measurement.selectedMetrics;
};

export default () => {
  const metrics = useSelector(getMetrics);

  return (
    <Provider value={client}>
      <SelectMetric />
      <MeasurementGraph metrics={metrics} />
    </Provider>
  );
};

const getMeasurements = (state: IState) => {
  // move to reducer
  const { measurements } = state.measurement;
  return {
    measurements,
  };
};

const MeasurementGraph = ({ metrics }: IProps) => { // create its own file
  const dispatch = useDispatch();
  const measurementsData = useSelector(getMeasurements);

  const [result] = useQuery({
    query,
    variables: {
      metrics,
    },
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.measurementDataRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  interface measurementDot {
    metric: string;
    value: number;
    at: number;
  }

  let graphData;

  if (measurementsData.measurements.length) {
    graphData = measurementsData.measurements[0].measurements.map(m => {
      return { name: m.at, temp: m.value };
    });
  } else {
    graphData = [{}];
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* {measurementsData.measurements.map(measurement => {
        return (
          <div>
            {measurement.metric}
            <ul>
              {measurement.measurements.map(measurement => {
                return <li>{measurement.value}</li>;
              })}
            </ul>
          </div>
        );
      })} */}
    </div>
  );
};

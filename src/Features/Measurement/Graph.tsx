import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';
import { IState } from '../../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { actions } from './reducer';

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

interface IProps {
  metrics: Array<Metric>;
}

interface Metric {
  metricName: string;
}

const Graph = ({ metrics }: IProps) => {
  const dispatch = useDispatch();
  const measurementsData = useSelector((state: IState) => state.measurement.measurements); // move to reducer

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

  let graphData = [{}];

  if (measurementsData.length) {
    graphData = measurementsData;
  }

  return (
    <div>
      {measurementsData.length ? (
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
            {metrics.map(metric => {
              return <Line type="monotone" dot={false} dataKey={metric.metricName} stroke={getRandomColor()} />;
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default Graph;

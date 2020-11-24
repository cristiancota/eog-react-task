import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from 'urql';
import CurrentMeasurementCard from './CurrentMeasurementCard';
import { actions, lastMeasurementSelector, measurementSelector } from './reducer';
import moment from 'moment';

const InitialMultipleMeasurements = `
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
  after: number;
}

const Graph = ({ metrics }: IProps) => {
  const dispatch = useDispatch();
  const measurementsData = useSelector(measurementSelector);
  const lastMeasurements = useSelector(lastMeasurementSelector);

  const [result] = useQuery({
    query: InitialMultipleMeasurements,
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

    const { getMultipleMeasurements: measurements } = data;
    dispatch(actions.measurementDataRecevied(measurements));
  }, [dispatch, data, error]);

  useEffect(() => {
    if (data && data.getMultipleMeasurements.length) {
      const interval = setInterval(() => {
        const timestamp = Date.now() - 1800000;
        if (!fetching) {
          const selectedMetrics = metrics.map((metric: Metric) => {
            return { metricName: metric.metricName, after: timestamp };
          });
          dispatch(actions.setSelectedMetrics(selectedMetrics));
          const { getMultipleMeasurements: measurements } = data;
          dispatch(actions.measurementDataRecevied(measurements));
        }
      }, 1300);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data]);

  let graphData = [{}];

  if (measurementsData.length) {
    graphData = measurementsData;
  }

  const formatter = (a: number) => {
    const d = new Date(a);
    return d.getHours() + ':' + (d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes());
  };

  const labelFormatter = (a: any) => {
    return moment(new Date(a)).format('MMM D YYYY, h:mm:ss a');
  };

  return (
    <div>
      {measurementsData.length ? (
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
              <XAxis dataKey="name" interval={220} tickFormatter={formatter} />
              <YAxis />
              <Tooltip labelFormatter={labelFormatter} />
              {metrics.map(metric => {
                return (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dot={false}
                    dataKey={metric.metricName}
                    stroke={getColor(metric.metricName)}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
          <div>
            {lastMeasurements.map(measurement => {
              return <CurrentMeasurementCard measurement={measurement} />;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const map = new Map();
map.set('flareTemp', '#9d0303');
map.set('casingPressure', '#9d039d');
map.set('injValveOpen', '#03439d');
map.set('oilTemp', '#039d83');
map.set('tubingPressure', '#039d12');
map.set('waterTemp', '#9d5403');

function getColor(index: string) {
  return map.get(index);
}

export default Graph;

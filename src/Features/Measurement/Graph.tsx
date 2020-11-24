import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from 'urql';
import { actions, measurementSelector, selectedMetrics } from './reducer';
import { Metric } from './types';
import { formatter, getColor, labelFormatter } from './util';

const multipleMeasurementsQuery = `
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

const Graph = () => {
  const dispatch = useDispatch();

  const measurementsData = useSelector(measurementSelector);
  const metrics = useSelector(selectedMetrics);

  const [result] = useQuery({
    query: multipleMeasurementsQuery,
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

    dispatch(actions.measurementDataRecevied(data.getMultipleMeasurements));
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
          dispatch(actions.measurementDataRecevied(data.getMultipleMeasurements));
        }
      }, 1300);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data]);

  return (
    <div>
      {measurementsData.length ? (
        <div>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={measurementsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="name" interval="preserveStartEnd" minTickGap={200} tickFormatter={formatter} />
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
        </div>
      ) : (
        <div>
          <p>Please select</p>
        </div>
      )}
    </div>
  );
};

export default Graph;

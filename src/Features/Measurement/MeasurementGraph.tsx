import LinearProgress from '@material-ui/core/LinearProgress';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, Provider, useQuery } from 'urql';
import SelectMetric from '../../components/SelectMetric';
import { IState } from '../../store';
import { actions } from './reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
  getMultipleMeasurements(input: [
      { metricName: "oilTemp" }, 
      { metricName: "flareTemp" }
    ]) {
    metric
    measurements {
      value
      at
    }
  }
}
`;

const getMeasurements = (state: IState) => {
  const { measurements } = state.measurement;
  return {
    measurements,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MeasurementGraph />
    </Provider>
  );
};

const MeasurementGraph = () => {
  const dispatch = useDispatch();
  const measurementsData = useSelector(getMeasurements);

  const [result] = useQuery({
    query,
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

  return (
    <div>
      <SelectMetric />
      {measurementsData.measurements.map(measurement => {
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
      })}
    </div>
  );
};

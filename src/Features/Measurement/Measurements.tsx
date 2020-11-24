import React from 'react';
import { useSelector } from 'react-redux';
import { createClient, Provider } from 'urql';
import SelectMetric from '../../components/SelectMetric';
import { IState } from '../../store';
import Graph from './Graph';

const client = createClient({
  // move to constants file
  url: 'https://react.eogresources.com/graphql',
});

const Measurements = () => {
  const metrics = useSelector((state: IState) => state.measurement.selectedMetrics); // move to reducer

  return (
    <Provider value={client}>
      <SelectMetric />
      <Graph metrics={metrics} />
    </Provider>
  );
};

export default Measurements;

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';
import { actions, availableMetricsSelector } from './../Features/Measurement/reducer';

const getMetricsQuery = `query { getMetrics }`;

export default function SelectMetric() {
  const dispatch = useDispatch();
  const metrics = useSelector(availableMetricsSelector);

  const [result] = useQuery({
    query: getMetricsQuery,
  });

  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }

    if (!data) return;
    dispatch(actions.setAvailableMetrics(data.getMetrics));
  }, [dispatch, data, error]);

  const handleOnchange = (_event: React.FormEvent<HTMLInputElement>, value: string[]) => {
    const selectedMetrics = value.map(val => {
      return {
        metricName: val,
      };
    });
    dispatch(actions.setSelectedMetrics(selectedMetrics));
  };

  return (
    <Autocomplete
      multiple
      id="autocomplete-metrics"
      options={metrics}
      getOptionLabel={option => option}
      renderInput={params => <TextField {...params} variant="standard" label="Metrics" />}
      onChange={(e: any, value: string[]) => handleOnchange(e, value)}
    />
  );
}

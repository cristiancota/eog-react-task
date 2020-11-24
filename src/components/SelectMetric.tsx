import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { actions } from './../Features/Measurement/reducer';
import { useDispatch } from 'react-redux';

export default function SelectMetric() {
  const dispatch = useDispatch();
  const thirtyMinutesAgo = Date.now() - 1800000;

  return (
    <Autocomplete
      multiple
      id="autocomplete-metrics"
      options={metrics}
      getOptionLabel={option => option}
      renderInput={params => <TextField {...params} variant="standard" label="Metrics" />}
      onChange={(event, value) => {
        const selectedMetrics = value.map(val => {
          return {
            metricName : val,
            after: thirtyMinutesAgo,
          };
        });
        dispatch(actions.setSelectedMetrics(selectedMetrics));
      }}
    />
  );
}

const metrics = ['flareTemp', 'casingPressure', 'injValveOpen', 'oilTemp', 'tubingPressure', 'waterTemp']; // create type and consume api

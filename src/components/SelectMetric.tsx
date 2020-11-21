import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { actions } from './../Features/Measurement/reducer';
import { useDispatch } from 'react-redux';

export default function SelectMetric() {
  const dispatch = useDispatch();

  return (
    <Autocomplete
      multiple
      id="autocomplete-metrics"
      options={metrics}
      getOptionLabel={option => option}
      renderInput={params => <TextField {...params} variant="standard" label="Metrics" />}
      onChange={(event, value) => {
        dispatch(actions.setMetrics(value));
      }}
    />
  );
}

const metrics = ['flareTemp', 'casingPressure', 'injValveOpen', 'oilTemp', 'tubingPressure', 'waterTemp']; // create type and consume api

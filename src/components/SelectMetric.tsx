import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';

export default function SelectMetric() {
  return (
    <Autocomplete
      multiple
      id="autocomplete-metrics"
      options={metrics}
      getOptionLabel={option => option}
      renderInput={params => <TextField {...params} variant="standard" label="Metrics" />}
      onChange={e => {
        console.log(e);
      }}
    />
  );
}

const metrics = ['flareTemp', 'casingPressure', 'injValveOpen', 'oilTemp', 'tubingPressure', 'waterTemp'];

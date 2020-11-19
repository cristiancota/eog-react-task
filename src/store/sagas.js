import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import measurementSaga from '../Features/Measurement/saga';

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(measurementSaga);
}

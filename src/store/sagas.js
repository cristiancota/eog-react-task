import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';

export default function* root() {
  yield spawn(weatherSaga);
}

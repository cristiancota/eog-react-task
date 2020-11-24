import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as MeasurementActions } from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction } from './types';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}

export default function* watchApiError() {
  yield takeEvery(MeasurementActions.measurementApiErrorReceived.type, apiErrorReceived);
}

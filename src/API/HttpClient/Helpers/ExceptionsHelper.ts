import { AxiosError } from 'axios';
import { parseInt } from 'lodash-es';
import { GeneralErrorData } from '../Interfaces/http-error.interface';

export function extractResponseCode(e: AxiosError): number | null {
  return e.response && e.response.status ? parseInt(String(e.response.status), 10) : null;
}

export function extractErrorId(e: AxiosError): string | null {
  const data = e.response && e.response.data ? e.response.data : null;
  return data ? (data as GeneralErrorData).error_id : null;
}

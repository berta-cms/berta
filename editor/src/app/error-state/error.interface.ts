export interface ErrorStateModel {
  message: string;
  httpStatus?: number;
  type?: 'warning' | 'error' | 'fatal';
  field?: string; // A path to a field. Something like: site-settings/language/language
}

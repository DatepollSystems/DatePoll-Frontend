declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  apiUrl: 'https://datepoll-backend.dafnik.me/api/'
};

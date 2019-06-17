declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  required_version: require('../../package.json').required_version,
  apiUrl: 'https://datepoll.dafnik.me:8443/api'
};

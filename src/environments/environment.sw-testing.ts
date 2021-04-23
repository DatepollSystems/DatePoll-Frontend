declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  required_version: require('../../package.json').required_version,
  apiUrl: 'http://' + window.location.hostname + ':9130/api',
  testing: true,
};

declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  apiUrl: 'http://127.0.0.1:8080'
};

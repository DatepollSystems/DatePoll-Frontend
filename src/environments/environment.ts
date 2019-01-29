declare const require: any;

export const environment = {
  production: false,
  version: require('../../package.json').version,
  apiUrl: 'http://localhost:8000/api'
};

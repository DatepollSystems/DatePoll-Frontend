declare const require: any;

export const environment = {
  production: false,
  version: require('../../package.json').version,
  required_version: require('../../package.json').required_version,
  apiUrl: 'http://' + window.location.hostname + ':8000/api',

  cinema_weatherforecast_openweathermap_city_id: require('../../keys.json').cinema_weatherforecast_openweathermap_city_id,
  cinema_weatherforecast_openweathermap_api_key: require('../../keys.json').cinema_weatherforecast_openweathermap_api_key,
};

# DatePoll-Frontend

![Start page](https://releases.datepoll.org/DatePoll/screenshot_startpage.png)

## Information

- Project website (https://datepoll.org)
- API / backend documentation (https://datepoll.org/docs/DatePoll)
- Other projects
  - [DatePoll-Backend](https://gitlab.com/DatePoll/DatePoll/datepoll-backend-php)
  - [DatePoll-Android](https://gitlab.com/DatePoll/DatePoll/datepoll-android)
  - [DatePoll-Dockerized](https://gitlab.com/DatePoll/DatePoll/datepoll-dockerized)
- created with [Angular](https://angular.io), [used libaries](https://gitlab.com/DatePoll/DatePoll/datepoll-frontend/-/blob/master/package.json).

## Releases

Releases are deployed into [this directory](https://releases.datepoll.org/DatePoll/Frontend-Releases/).

There are 3 different build types:

1. Latest release version (builded after a tag is created): [DatePoll-Frontend-latest.zip](https://releases.datepoll.org/DatePoll/Frontend-Releases/DatePoll-Frontend-latest.zip)
1. Latest dev version (builded after every commit to [development](https://gitlab.com/DatePoll/DatePoll/datepoll-frontend/-/tree/development)): [DatePoll-Frontend-dev.zip](https://releases.datepoll.org/DatePoll/Frontend-Releases/DatePoll-Frontend-dev.zip)
1. Release candidate version (updated only sometimes): [DatePoll-Frontend-rc.zip](https://releases.datepoll.org/DatePoll/Frontend-Releases/DatePoll-Frontend-rc.zip)

## Development

A more complete / more detailed development setup guide can be found [here](https://datepoll.org/docs/DatePoll/devAndBuilding).

### Requirements

- NodeJS
- NPM

### Installation

- Clone the repo ([https](https://gitlab.com/DatePoll/DatePoll/datepoll-frontend.git), [ssh](git@gitlab.com:DatePoll/DatePoll/datepoll-frontend.git))
- Run `npm install`

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Create dev build with service worker

```bash
rm -rf dist/DatePoll-Frontend && ng build --configuration=sw-testing
```

Serve dev build

```bash
 npm install http-server-spa -g
```

```bash
http-server-spa dist/DatePoll-Frontend/ index.html 4200
```

### Build

Run `ng build --prod` in the `src`-folder to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

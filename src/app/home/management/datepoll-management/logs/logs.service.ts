import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpService} from '../../../../utils/http.service';
import {Log, LogType} from './log.model';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private logs: Log[] = [];
  public logsChange: Subject<Log[]> = new Subject<Log[]>();

  constructor(private httpService: HttpService) {}

  public getLogs(): Log[] {
    this.fetchLogs();
    return this.logs.slice();
  }

  private setLogs(logs: Log[]) {
    this.logs = logs;
    this.logsChange.next(this.logs.slice());
  }

  private fetchLogs() {
    this.httpService.loggedInV1GETRequest('/system/logs', 'fetchLogs').subscribe(
      (response: any) => {
        console.log(response);

        const logs = [];
        for (const log of response.logs) {
          let logType;
          switch (log.type) {
            case 'INFO':
              logType = LogType.INFO;
              break;
            case 'WARNING':
              logType = LogType.WARNING;
              break;
            case 'ERROR':
              logType = LogType.ERROR;
              break;
            default:
              console.log('fetchLogs | Error unknown log type: ' + log.type);
              break;
          }
          logs.push(new Log(log.id, logType, log.type, log.message, log.created_at));
        }

        this.setLogs(logs);
      },
      error => console.log(error)
    );
  }

  public deleteLogs() {
    this.httpService.loggedInV1DELETERequest('/system/logs/all', 'deleteAllLogs').subscribe(
      (response: any) => {
        console.log(response);
        this.fetchLogs();
      },
      error => console.log(error)
    );
  }
}

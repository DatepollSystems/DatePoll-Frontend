import {Injectable} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Session} from './session.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  public sessionsChange: Subject<Session[]> = new Subject<Session[]>();
  private _sessions: Session[] = null;

  constructor(private httpService: HttpService) {
  }

  public getSessions(): Session[] {
    this.fetchSessions();

    if (this._sessions == null) {
      return null;
    }
    return this._sessions.slice();
  }

  public fetchSessions() {
    this.httpService.loggedInV1GETRequest('/user/myself/session').subscribe(
      (data: any) => {
        console.log(data);

        const sessionsObject = [];

        const sessions = data.sessions;
        for (let i = 0; i < sessions.length; i++) {
          const session = sessions[i];

          const sessionObject = new Session(session.id, session.information, session.lastUsed);
          sessionsObject.push(sessionObject);
        }

        this.setSessions(sessionsObject);
      },
      (error) => console.log(error)
    );
  }

  public removeSession(id: number) {
    return this.httpService.loggedInV1DELETERequest('/user/myself/session/' + id, 'removeSession');
  }

  private setSessions(sessions: Session[]) {
    this._sessions = sessions;
    this.sessionsChange.next(this._sessions.slice());
  }

}

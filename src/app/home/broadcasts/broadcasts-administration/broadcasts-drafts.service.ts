import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Converter} from '../../../utils/helper/Converter';
import {HttpService} from '../../../utils/http.service';
import {Broadcast, UserBroadcastInfo} from '../models/broadcast.model';
import {BroadcastDraft} from '../models/broadcast-draft.model';

@Injectable({
  providedIn: 'root',
})
export class BroadcastsDraftsService {
  private _drafts: BroadcastDraft[] = [];
  public draftsChange: Subject<BroadcastDraft[]> = new Subject<BroadcastDraft[]>();

  private draft: BroadcastDraft;
  public draftChange = new Subject<BroadcastDraft>();

  constructor(private httpService: HttpService) {}

  public getDrafts(): BroadcastDraft[] {
    this.fetchDrafts();
    return this._drafts.slice();
  }

  private setDrafts(drafts: BroadcastDraft[]) {
    this._drafts = drafts;
    this.draftsChange.next(this._drafts.slice());
  }

  public fetchDrafts() {
    this.httpService.loggedInV1GETRequest('/broadcast/administration/draft', 'fetchDrafts').subscribe(
      (response: any) => {
        console.log(response);

        const drafts = [];
        for (const draft of response.drafts) {
          const toSaveDraft = new BroadcastDraft(draft.id, draft.subject, draft.body, draft.writer_name);
          toSaveDraft.bodyHTML = draft.bodyHTML;
          drafts.push(toSaveDraft);
        }
        this.setDrafts(drafts);
      },
      (error) => console.log(error)
    );
  }

  public setDraft(draft: BroadcastDraft) {
    this.draft = draft;
    this.draftChange.next(this.draft);
  }

  public getDraft(id: number) {
    this.fetchDraft(id);
    return this.draft;
  }

  private fetchDraft(id: number) {
    this.httpService.loggedInV1GETRequest('/broadcast/administration/draft/' + id, 'fetchDraft').subscribe(
      (response: any) => {
        console.log(response);
        const dto = response.draft;
        const draft = new BroadcastDraft(dto.id, dto.subject, dto.body, dto.writer_name);
        draft.bodyHTML = dto.bodyHTML;
        this.setDraft(draft);
      },
      (error) => console.log(error)
    );
  }

  public create(draft: BroadcastDraft) {
    const dto = {
      subject: draft.subject,
      body: draft.body,
      bodyHTML: draft.bodyHTML,
    };

    return this.httpService.loggedInV1POSTRequest('/broadcast/administration/draft', dto, 'createDraft');
  }

  public update(draft: BroadcastDraft, draftId: number) {
    const dto = {
      subject: draft.subject,
      body: draft.body,
      bodyHTML: draft.bodyHTML,
    };

    return this.httpService.loggedInV1PUTRequest('/broadcast/administration/draft/' + draftId, dto, 'updateDraft');
  }

  public delete(id: number) {
    return this.httpService.loggedInV1DELETERequest('/broadcast/administration/draft/' + id, 'deleteDraft');
  }
}

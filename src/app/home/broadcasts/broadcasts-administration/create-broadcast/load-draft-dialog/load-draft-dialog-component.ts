import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {UIHelper} from '../../../../../utils/helper/UIHelper';
import {BroadcastsDraftsService} from '../../broadcasts-drafts.service';
import {NotificationService} from '../../../../../utils/notification.service';

import {BroadcastDraft} from '../../../models/broadcast-draft.model';

@Component({
  selector: 'app-load-draft-dialog',
  templateUrl: './load-draft-dialog.component.html',
  styleUrls: ['./load-draft-dialog.component.css'],
})
export class LoadDraftDialogComponent implements OnDestroy {
  drafts: BroadcastDraft[];
  draftsSubscription: Subscription;

  constructor(
    private draftsService: BroadcastsDraftsService,
    private router: Router,
    private notificationService: NotificationService,
    private bottomSheetRef: MatBottomSheetRef<LoadDraftDialogComponent>
  ) {
    this.drafts = this.draftsService.getDrafts();
    this.draftsSubscription = this.draftsService.draftsChange.subscribe((value) => {
      this.drafts = value;
    });
  }

  ngOnDestroy() {
    this.draftsSubscription.unsubscribe();
  }

  getBroadcastContentPreview(str: string): string {
    return UIHelper.cutString(str, 35);
  }

  loadDraft(draft: BroadcastDraft) {
    this.draftsService.setDraft(draft);
    this.router.navigate(['/home/broadcasts/administration/draft/' + draft.id]);
    this.bottomSheetRef.dismiss();
  }

  deleteDraft(draft: BroadcastDraft) {
    this.draftsService.delete(draft.id).subscribe(
      (response: any) => {
        console.log(response);
        this.notificationService.info('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_DELETED');
        this.draftsService.fetchDrafts();
        this.bottomSheetRef.dismiss();
      },
      (error) => {
        console.log(error);
        this.draftsService.fetchDrafts();
        this.bottomSheetRef.dismiss();
      }
    );
    this.router.navigate(['/home/broadcasts/administration/create']);
  }
}

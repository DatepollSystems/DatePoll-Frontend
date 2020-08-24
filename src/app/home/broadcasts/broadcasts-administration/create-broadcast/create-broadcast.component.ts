import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {NotificationsService} from 'angular2-notifications';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../../../management/groups-management/groups.service';
import {BroadcastsAdministrationService} from '../broadcasts-administration.service';
import {BroadcastsDraftsService} from '../broadcasts-drafts.service';

import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';
import {LoadDraftDialogComponent} from './load-draft-dialog/load-draft-dialog-component';

import {GroupAndSubgroupModel} from '../../../../utils/models/groupAndSubgroup.model';
import {BroadcastDraft} from '../../models/broadcast-draft.model';

@Component({
  selector: 'app-create-broadcast',
  templateUrl: './create-broadcast.component.html',
  styleUrls: ['./create-broadcast.component.css']
})
export class CreateBroadcastComponent implements OnDestroy {
  groupsAndSubgroups: GroupAndSubgroupModel[] = [];
  groupsSubscription: Subscription;

  allMembers = false;
  selectedGroupsAndSubgroups: GroupAndSubgroupModel[] = [];

  subject = '';
  body = '';
  bodyHTML = '';

  draftId = -1;
  draft: BroadcastDraft;
  draftSubscription: Subscription;

  constructor(
    private broadcastsService: BroadcastsAdministrationService,
    private draftsService: BroadcastsDraftsService,
    private groupsService: GroupsService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private translate: TranslateService
  ) {
    this.groupsAndSubgroups = this.groupsService.getGroupsAndSubgroups();
    this.groupsSubscription = this.groupsService.groupsAndSubgroupsChange.subscribe(value => {
      this.groupsAndSubgroups = value;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id != null) {
        this.draftId = Number(id);
        this.draft = this.draftsService.getDraft(this.draftId);
        this.remake();
        console.log('Draft to load: ' + id);

        this.draftSubscription = this.draftsService.draftChange.subscribe(value => {
          this.draft = value;
          this.remake();
        });
      } else {
        console.log('No draft to load');
      }
    });
  }

  remake() {
    if (this.draft) {
      this.subject = this.draft.subject;
      this.body = this.draft.body;
      this.bodyHTML = this.draft.bodyHTML;
    }
  }

  ngOnDestroy(): void {
    this.groupsSubscription.unsubscribe();
    if (this.draftSubscription) {
      this.draftSubscription.unsubscribe();
    }
  }

  bodyChanged(body: string) {
    this.body = body;
  }

  bodyHTMLChanged(bodyHTML: string) {
    this.bodyHTML = bodyHTML;
  }

  allMembersChanged(checked: boolean) {
    this.allMembers = checked;
  }

  groupsAndSubgroupChanged(groupsAndSubgroups: GroupAndSubgroupModel[]) {
    this.selectedGroupsAndSubgroups = groupsAndSubgroups;
    console.log(this.selectedGroupsAndSubgroups);
  }

  loadDraft() {
    this.bottomSheet.open(LoadDraftDialogComponent);
  }

  saveDraft() {
    if (this.subject.length < 1 || this.subject.length > 190) {
      console.log('Subject size wrong! - ' + this.subject.length);
      this.notificationService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SUBJECT_LENGTH')
      );
      return;
    }

    if (this.body.length < 10) {
      console.log('Mail body length < 10');
      this.notificationService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_BODY_LENGTH')
      );
      return;
    }

    const draft = new BroadcastDraft(-1, this.subject, this.body, null);
    draft.bodyHTML = this.bodyHTML;
    this.draftsService.setDraft(draft);

    if (this.draftId < 0) {
      this.draftsService.create(draft).subscribe(
        (response: any) => {
          console.log(response);
          this.notificationService.success(
            this.translate.getTranslationFor('SUCCESSFULLY'),
            this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_SAVED')
          );
          this.router.navigate(['/home/broadcasts/administration/draft/' + response.draft.id]);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.draftsService.update(draft, this.draftId).subscribe(
        (response: any) => {
          console.log(response);
          this.notificationService.success(
            this.translate.getTranslationFor('SUCCESSFULLY'),
            this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_SAVED')
          );
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  send() {
    if (this.subject.length < 1 || this.subject.length > 190) {
      console.log('Subject size wrong! - ' + this.subject.length);
      this.notificationService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SUBJECT_LENGTH')
      );
      return;
    }

    if (this.selectedGroupsAndSubgroups.length === 0 && !this.allMembers) {
      console.log('Groups length 0! - ' + this.selectedGroupsAndSubgroups.length + ' And allMembers - ' + this.allMembers);
      this.notificationService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_NO_GROUPS_AND_NOT_ALL_MEMBERS')
      );
      return;
    }

    if (this.body.length < 10) {
      console.log('Mail body length < 10');
      this.notificationService.alert(
        this.translate.getTranslationFor('WARNING'),
        this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_BODY_LENGTH')
      );
      return;
    }

    const answers = [
      {
        answer: this.translate.getTranslationFor('YES'),
        value: 'yes'
      },
      {
        answer: this.translate.getTranslationFor('NO'),
        value: 'no'
      }
    ];
    const question = this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_CONFIRM_QUESTION');

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        answers,
        question
      }
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value != null) {
        if (value.includes('yes')) {
          const groups = [];
          const subgroups = [];
          if (!this.allMembers) {
            for (const group of this.selectedGroupsAndSubgroups) {
              if (group.type === 0) {
                groups.push(group.id);
              } else if (group.type === 1) {
                subgroups.push(group.id);
              } else {
                console.log('Unknown group type in createBroadcast - ' + group.type);
                this.notificationService.error(
                  this.translate.getTranslationFor('ERROR'),
                  this.translate.getTranslationFor('REQUEST_ERROR')
                );
                return;
              }
            }
          }

          const broadcast = {
            subject: this.subject,
            bodyHTML: this.bodyHTML,
            body: this.body,
            for_everyone: this.allMembers,
            groups,
            subgroups
          };

          this.notificationService.info(
            this.translate.getTranslationFor('INFORMATION'),
            this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SENDING_LENGTH'),
            {timeOut: 8000}
          );
          this.broadcastsService.createBroadcast(broadcast).subscribe(
            (response: any) => {
              console.log(response);
              this.broadcastsService.fetchBroadcasts();
              this.notificationService.success(
                this.translate.getTranslationFor('SUCCESSFULLY'),
                this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SUCCESSFUL'),
                {timeOut: 8000}
              );
              // Delete draft of email if broadcast was successful created
              if (this.draftId > -1) {
                this.draftsService.delete(this.draftId).subscribe(
                  (deleteResponse: any) => {
                    console.log(deleteResponse);
                    this.notificationService.success(
                      this.translate.getTranslationFor('SUCCESSFULLY'),
                      this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_DELETED')
                    );
                    this.draftsService.fetchDrafts();
                  },
                  error => {
                    console.log(error);
                  }
                );
              }
              this.router.navigate(['/home/broadcasts/administration']);
            },
            error => console.log(error)
          );
        }
      }
    });
  }
}

import {Component, OnDestroy} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {MatSnackBar} from '@angular/material/snack-bar';

import {TranslateService} from '../../../../translation/translate.service';
import {GroupsService} from '../../../management/groups-management/groups.service';
import {BroadcastsAdministrationService} from '../broadcasts-administration.service';
import {BroadcastsDraftsService} from '../broadcasts-drafts.service';

import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';
import {LoadDraftDialogComponent} from './load-draft-dialog/load-draft-dialog-component';

import {GroupAndSubgroupModel} from '../../../../utils/shared-components/group-and-subgroup-type-input-select/groupAndSubgroup.model';
import {BroadcastDraft} from '../../models/broadcast-draft.model';
import {Attachment} from './broadcast-attachment/broadcast-attachment.component';

@Component({
  selector: 'app-create-broadcast',
  templateUrl: './create-broadcast.component.html',
  styleUrls: ['./create-broadcast.component.css'],
})
export class CreateBroadcastComponent implements OnDestroy {
  groupsAndSubgroups: GroupAndSubgroupModel[] = [];
  groupsSubscription: Subscription;

  allMembers = false;
  selectedGroupsAndSubgroups: GroupAndSubgroupModel[] = [];

  attachments: Attachment[] = [];
  currentlyUploading = false;

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
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.groupsAndSubgroups = this.groupsService.getGroupsAndSubgroups();
    this.groupsSubscription = this.groupsService.groupsAndSubgroupsChange.subscribe((value) => {
      this.groupsAndSubgroups = value;
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id != null) {
        this.draftId = Number(id);
        this.draft = this.draftsService.getDraft(this.draftId);
        this.remake();
        console.log('Draft to load: ' + id);

        this.draftSubscription = this.draftsService.draftChange.subscribe((value) => {
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

  attachmentsChanged(attachments: Attachment[]) {
    this.attachments = attachments;
    console.log(this.attachments);
  }

  currentlyUploadingChanged(currentUploading: boolean) {
    this.currentlyUploading = currentUploading;
  }

  leave() {
    for (const attachment of this.attachments) {
      this.broadcastsService.deleteAttachment(attachment.id).subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
    }
  }

  loadDraft() {
    this.bottomSheet.open(LoadDraftDialogComponent);
  }

  makeCheck() {
    if (this.subject.length < 1 || this.subject.length > 190) {
      console.log('Subject size wrong! - ' + this.subject.length);
      this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SUBJECT_LENGTH'));
      return false;
    }

    if (this.body.length < 10) {
      console.log('Mail body length < 10');
      this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_BODY_LENGTH'));
      return false;
    }

    return true;
  }

  saveDraft() {
    if (!this.makeCheck()) {
      return;
    }

    const draft = new BroadcastDraft(-1, this.subject, this.body, null);
    draft.bodyHTML = this.bodyHTML;
    this.draftsService.setDraft(draft);

    if (this.draftId < 0) {
      this.draftsService.create(draft).subscribe(
        (response: any) => {
          console.log(response);
          this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_SAVED'));
          this.router.navigate(['/home/broadcasts/administration/draft/' + response.draft.id]);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.draftsService.update(draft, this.draftId).subscribe(
        (response: any) => {
          console.log(response);
          this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_SAVED'));
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  send() {
    if (!this.makeCheck()) {
      return;
    }

    if (this.selectedGroupsAndSubgroups.length === 0 && !this.allMembers) {
      console.log('Groups length 0! - ' + this.selectedGroupsAndSubgroups.length + ' And allMembers - ' + this.allMembers);
      this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_NO_GROUPS_AND_NOT_ALL_MEMBERS'));
      return;
    }

    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'BROADCASTS_ADMINISTRATION_CREATE_CONFIRM_QUESTION',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
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
              this.snackBar.open(this.translate.getTranslationFor('REQUEST_ERROR'));
              return;
            }
          }
        }

        const attachmentIds = [];
        for (const attachment of this.attachments) {
          attachmentIds.push(attachment.id);
        }

        const broadcast = {
          subject: this.subject,
          bodyHTML: this.bodyHTML,
          body: this.body,
          for_everyone: this.allMembers,
          groups,
          subgroups,
          attachments: attachmentIds,
        };

        this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SENDING_LENGTH'));
        this.broadcastsService.createBroadcast(broadcast).subscribe(
          (response: any) => {
            console.log(response);
            this.broadcastsService.fetchBroadcasts();
            this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_SUCCESSFUL'));
            // Delete draft of email if broadcast was successful created
            if (this.draftId > -1) {
              this.draftsService.delete(this.draftId).subscribe(
                (deleteResponse: any) => {
                  console.log(deleteResponse);
                  this.snackBar.open(
                    this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_CREATE_NOTIFICATION_DRAFT_SUCCESSFUL_DELETED')
                  );
                  this.draftsService.fetchDrafts();
                },
                (error) => {
                  console.log(error);
                }
              );
            }
          },
          (error) => console.log(error)
        );
        this.router.navigate(['/home/broadcasts/administration']);
      }
    });
  }
}

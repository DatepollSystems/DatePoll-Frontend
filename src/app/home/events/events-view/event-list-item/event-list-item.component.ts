import {Component, Input} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

import {EventsVoteForDecisionModalComponent} from '../events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';

import {EventsUserService} from '../../services/events-user.service';
import {TranslateService} from '../../../../translation/translate.service';
import {HomepageService} from '../../../start/homepage.service';

import {Event} from '../../models/event.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-event-list-item]',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.css'],
})
export class EventListItemComponent {
  @Input()
  event: Event;

  eventVotingChangeLoading = false;

  constructor(
    private bottomSheet: MatBottomSheet,
    private eventsUserService: EventsUserService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private homePageService: HomepageService,
    private router: Router
  ) {}

  onEventInfo(event: Event) {
    this.router.navigateByUrl('/home/events/' + event.id, {state: event});
  }

  onEventItemClick(event: Event) {
    if (event.alreadyVotedFor) {
      this.cancelEventVoting(event, null);
    } else {
      this.onEventVote(event);
    }
  }

  public onEventVote(event: Event) {
    const bottomSheetRef = this.bottomSheet.open(EventsVoteForDecisionModalComponent, {
      data: {event},
    });

    bottomSheetRef.afterDismissed().subscribe((dto) => {
      if (dto != null) {
        this.eventsUserService.voteForDecision(event.id, dto.decision, dto.additionalInformation).subscribe(
          (response: any) => {
            console.log(response);
            this.homePageService.fetchData(true);
            this.snackBar.open(this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_VOTED'));
          },
          (error) => console.log(error)
        );
      } else {
        console.log('events-view | Closed bottom sheet, voted for nohting');
      }
    });
  }

  public cancelEventVoting(event, button: any) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'EVENTS_CANCEL_VOTING',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        if (this.eventVotingChangeLoading) {
          return;
        }
        this.eventVotingChangeLoading = true;
        if (button) {
          button.disabled = true;
        }
        this.eventsUserService.removeDecision(event.id).subscribe(
          (response: any) => {
            console.log(response);
            this.homePageService.fetchData(true);
            this.snackBar.open(this.translate.getTranslationFor('EVENTS_VIEW_EVENT_SUCCESSFULLY_REMOVED_VOTING'));
          },
          (error) => {
            console.log(error);
            this.eventVotingChangeLoading = false;
          }
        );
      }
    });
  }
}

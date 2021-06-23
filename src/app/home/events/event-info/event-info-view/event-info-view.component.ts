import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Event} from '../../models/event.model';
import {UIHelper} from '../../../../utils/helper/UIHelper';
import {EventsVoteForDecisionModalComponent} from '../../events-view/events-vote-for-decision-modal/events-vote-for-decision-modal.component';
import {QuestionDialogComponent} from '../../../../utils/shared-components/question-dialog/question-dialog.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {EventsUserService} from '../../services/events-user.service';
import {NotificationService} from '../../../../utils/notification.service';

@Component({
  selector: 'app-event-info-view',
  templateUrl: './event-info-view.component.html',
  styleUrls: ['./event-info-view.component.css'],
})
export class EventInfoViewComponent {
  event: Event;
  objectLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private eventsUserService: EventsUserService,
    private notificationService: NotificationService
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id != null) {
        console.log('Event to open: ' + id);

        const localEvent = window.history.state;
        console.log(localEvent);
        if (localEvent != null) {
          if (localEvent?.name) {
            this.event = new Event(
              Number(id),
              localEvent.name,
              UIHelper.getCurrentDate(),
              UIHelper.getCurrentDate(),
              false,
              'Loading',
              [],
              []
            );
            return;
          }
          this.event = new Event(Number(id), 'Loading', UIHelper.getCurrentDate(), UIHelper.getCurrentDate(), false, 'Loading', [], []);
        }
      } else {
        console.log('No event to open');
      }
    });
  }

  eventLoaded(event: Event) {
    this.event = event;
    this.objectLoaded = true;
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
            this.eventsUserService.getEvent(this.event.id);
            this.notificationService.info('EVENTS_VIEW_EVENT_SUCCESSFULLY_VOTED');
          },
          (error) => console.log(error)
        );
      } else {
        console.log('events-view | Closed bottom sheet, voted for nohting');
      }
    });
  }

  public cancelEventVoting(event: Event) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'EVENTS_CANCEL_VOTING',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.eventsUserService.removeDecision(event.id).subscribe(
          (response: any) => {
            console.log(response);
            this.eventsUserService.getEvent(this.event.id);
            this.notificationService.info('EVENTS_VIEW_EVENT_SUCCESSFULLY_REMOVED_VOTING');
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }
}

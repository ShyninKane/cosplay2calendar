import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { DurationIcon, EventType, IEventDTO } from 'src/app/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Cosplay2Calendar';

  displayedColumns: string[] = [
    'status',
    'type',
    'start',
    'duration',
    'title',
    'city',
    'actions',
  ];

  toppings = new FormControl('');
  toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  data$: Observable<any[]> = this.appService.loadData().pipe(
    tap((res) => {
      res;
    })
  );

  constructor(private appService: AppService) {}

  ngOnInit() {}

  getEventType(eventTypeId: string): string {
    return EventType[eventTypeId];
  }

  getDurationIcon(item: IEventDTO) {
    const duration = this.getDuration(item);

    const res = DurationIcon[duration];
    return res || duration;
  }

  getDuration(item: IEventDTO): number {
    const startDate = new Date(item.start_time.split(' ')[0]);
    const endDate = new Date(item.end_time.split(' ')[0]);

    return this.dateDiffInDays(startDate, endDate);
  }

  private dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;
  }
}

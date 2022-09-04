import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventType, ICalendarState, IEventDTO } from 'src/app/models';
import { catchError, map, skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  api: string = 'https://cosplay2.ru/api/events/filter_list';

  constructor(private http: HttpClient) {}

  loadData(): Observable<ICalendarState> {
    return this.http.post<{ events: IEventDTO[] }>(this.api, {}).pipe(
      map((res) => {
        const events = res.events;

        const typeOptions = [
          ...new Set(events.map((x) => EventType[Number(x.event_type_id)])),
        ].sort();

        const cityOptions = [...new Set(events.map((x) => x.city))].sort();

        const yearOptions = [];
        const currentYear = new Date().getFullYear();
        for (let i = 1; i <= 1; i++) {
          yearOptions.push(currentYear + i);
        }
        yearOptions.push(currentYear);
        for (let i = 1; i <= 5; i++) {
          yearOptions.push(currentYear - i);
        }

        return {
          events: events,
          typeOptions,
          cityOptions,
          yearOptions,
        };
      })
    );
  }
}

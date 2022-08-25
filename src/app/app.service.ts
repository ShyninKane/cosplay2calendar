import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEventDTO } from 'src/app/models';
import { catchError, map, skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  api: string = 'https://cosplay2.ru/api/events/filter_list';

  constructor(private http: HttpClient) {}

  loadData(): Observable<IEventDTO[]> {
    return this.http.post<any>(this.api, {}).pipe(map((res) => res));
  }
}

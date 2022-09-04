import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventType, ICalendarState, IEventDTO } from 'src/app/models';
import { catchError, map, skip, switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ICoords {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  reverseGeocodeApi: string =
    'https://api.bigdatacloud.net/data/reverse-geocode-client';
  googleEmbeddedMapApi: string = 'https://maps.google.com/maps';

  // https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=55.033856&longitude=82.9456384&localityLanguage=ru

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getUserLocation(): Observable<string> {
    return Observable.create((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => observer.error(error)
      );
    }).pipe(
      switchMap((location: GeolocationPosition) => {
        const geoCoords = location.coords;

        const coords: ICoords = {
          lat: geoCoords.latitude,
          lon: geoCoords.longitude,
        };
        return this.getCityFromLocation(coords);
      })
    );
  }

  getCityFromLocation(coords: ICoords): Observable<string> {
    return this.http
      .get<any>(this.reverseGeocodeApi, {
        params: {
          localityLanguage: 'en',
          latitude: coords.lat,
          longitude: coords.lon,
        },
      })
      .pipe(map((res) => res.city));
  }

  getMapSrc(center: string): SafeResourceUrl {
    const src = `${this.googleEmbeddedMapApi}?q=${center}&t=&z=6&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  getApproxDistance(c1: ICoords, c2: ICoords): number {
    const φ1 = (c1.lat * Math.PI) / 180,
      φ2 = (c2.lat * Math.PI) / 180,
      Δλ = ((c2.lon - c1.lon) * Math.PI) / 180,
      R = 6371e3;
    const d =
      Math.acos(
        Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)
      ) * R;
    return Math.round(d) / 1000; // distance in km
  }
}

import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { cities, city_en_ru } from 'src/app/db';
import {
  DurationIcon,
  EventType,
  ICalendarState,
  IEventDTO,
} from 'src/app/models';
import {
  GeolocationService,
  ICoords,
} from 'src/app/services/geolocation.service';

interface ICityIconItem {
  title: string;
  class: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Geek Calendar';

  userCity: string = 'Новосибирск';
  mapSrc: SafeResourceUrl;

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

  data$: Observable<ICalendarState> = this.appService.loadData();

  constructor(
    private appService: AppService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    this.geolocationService.getUserLocation().subscribe((userCity) => {
      this.userCity = userCity;
      this.mapSrc = this.geolocationService.getMapSrc(userCity);
    });
  }

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

  getCityIconItem(eventCity: string): ICityIconItem {
    const eventCityEn = city_en_ru.find(
      (x) => x.city_ru === eventCity
    )?.city_en;

    let cityIconItem: ICityIconItem;
    if (eventCityEn === this.userCity) {
      cityIconItem = {
        title: 'home',
        class: 'upcoming-icon',
      };
      return cityIconItem;
    }

    const userCityItem = cities.find((x) => x.city === this.userCity);
    const eventCityItem = cities.find((x) => x.city === eventCityEn);
    const distance = this.getDistance(userCityItem, eventCityItem);

    let iconName;
    if (distance > 1000) {
      iconName = 'flight';
    } else if (distance > 500) {
      iconName = 'train';
    } else if (!!distance) {
      iconName = 'commute';
    } else {
    }

    return {
      title: iconName,
      class: 'multiple-days-icon',
    };
  }

  getDistance(city1, city2): number {
    let d;
    try {
      d = this.geolocationService.getApproxDistance(
        { lat: Number(city1.lat), lon: Number(city1.lng) },
        { lat: Number(city2.lat), lon: Number(city2.lng) }
      );
    } catch (e) {
      console.log(city2);
    }
    return d;
  }
}

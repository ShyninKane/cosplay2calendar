export interface IEventDTO {
  city: string; // "Димитровград"
  domain: any; // null
  end_time: string; //"2022-07-30 14:00:00"
  event_type_id: string; // "1"
  href: string; // "https://mizuki.cosplay2.ru"
  id: string; // "764"
  month: string; // "07"
  start_time: string; // "2022-07-30 09:00:00"
  subdomain: string; // "mizuki"
  time: string; // "30 июля"
  timestatus: string; // "past"
  title: string; // "MIZUKI FEST 2022"
}

export enum EventType {
  'Косплей' = 1,
  'Вечеринка' = 2,
  'Ярмарка' = 3,
  'Выставка' = 4,
  'Танцевальный' = 5,
  'Конвент' = 8,
}

export enum DurationIcon {
  looks_one = 1,
  looks_two = 2,
  looks_3 = 3,
  looks_4 = 4,
  looks_5 = 5,
  looks_6 = 6,
}

export interface ICalendarState {
  events: IEventDTO[];
  typeOptions: string[];
  cityOptions: string[];
  yearOptions: string[];
}

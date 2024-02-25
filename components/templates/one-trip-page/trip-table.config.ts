import { Section } from '@/types/models'
import { ChipProps } from '@nextui-org/react'

export const columns = [
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Status', uid: 'status', sortable: true },
  { name: 'Transport or placement', uid: 'transportType', sortable: true },
  // { name: 'Placement', uid: 'placementType', sortable: true },
  { name: 'Start', uid: 'dateTimeStart' },
  { name: 'End', uid: 'dateTimeEnd' },
  { name: 'Provider', uid: 'serviceProvider' },
  { name: 'Notes', uid: 'notes' },
  { name: 'Actions', uid: 'actions' },
]

export const statusColorMap: Record<string, ChipProps['color']> = {
  bought: 'success',
  reserved: 'primary',
  to_buy: 'danger',
  to_find: 'warning',
}

export const statusOptionsMap = {
  bought: 'Bought',
  reserved: 'Reserved',
  to_buy: 'To buy',
  to_find: 'To find',
}

export const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'status',
  'transportType',
  'dateTimeStart',
  'dateTimeEnd',
  'actions',
]

export const sections: Section[] = [
  {
    name: 'Wroclaw - Warsaw',
    type: 'road',
    points: [],
    dateTimeStart: '2022-12-23T16:15:46.953Z',
    dateTimeEnd: '2022-12-23T20:40:48.953Z',
    transportType: 'bus',
    serviceProvider: {
      name: 'FlixBus',
      link: 'https://flixbus.com',
    },
    status: 'bought',
    payments: [
      {
        name: 'Common',
        price: {
          amount: 52,
          currency: 'EUR',
        },
        _id: '63a4ad87abc9936249f146db',
      },
    ],
    notes: 'Ticket in the app',
    _id: '63a4ad87abc9936249f146da',
  },
  {
    name: 'Warsaw - Minsk',
    type: 'road',
    points: [],
    dateTimeStart: '2022-12-23T22:15:39.460Z',
    dateTimeEnd: '2022-12-24T09:20:05.460Z',
    transportType: 'bus',
    serviceProvider: {
      name: 'Intercars',
    },
    status: 'bought',
    payments: [
      {
        name: 'Andrey',
        link: 'https://drive.google.com/file/d/1FEl0LyIS_DC0rS3X4xUhaL_u0Mjjsk-X/view?usp=share_link',
        price: {
          amount: 100,
          currency: 'EUR',
        },
        _id: '63a57d919c97c2505d0b03d0',
      },
      {
        name: 'Yuliya',
        link: 'https://drive.google.com/file/d/1FEl0LyIS_DC0rS3X4xUhaL_u0Mjjsk-X/view?usp=share_link',
        price: {
          amount: 201,
          currency: 'EUR',
        },
        _id: '6457eb4ec496835115280c24',
      },
    ],
    _id: '63a4cc781793590f32fb6877',
  },
  {
    name: 'Minsk parents',
    type: 'stay',
    points: [],
    dateTimeStart: '2022-12-25T11:00:42.183Z',
    dateTimeEnd: '2022-12-26T08:20:46.183Z',
    placementType: 'flat',
    serviceProvider: {
      name: 'Parents',
    },
    status: 'reserved',
    payments: [],
    notes: "Free stay with Andrey's parents",
    _id: '63a57dfd9c97c2505d0b03df',
  },
  {
    name: 'Minsk - Postavy',
    type: 'road',
    points: [],
    dateTimeStart: '2022-12-26T12:17:03.780Z',
    dateTimeEnd: '2022-12-26T13:00:49.780Z',
    transportType: 'bus',
    status: 'to_buy',
    payments: [
      {
        name: 'approx',
        price: {
          amount: 12,
          currency: 'EUR',
        },
        _id: '63a584019c97c2505d0b06f2',
      },
    ],
    _id: '63a57e509c97c2505d0b03f1',
    serviceProvider: null,
  },
  {
    name: 'Postavy parents',
    type: 'stay',
    points: [],
    dateTimeStart: '2022-12-25T17:00:31.007Z',
    dateTimeEnd: '2022-12-29T09:30:04.007Z',
    placementType: 'flat',
    serviceProvider: {
      name: 'Parents',
    },
    status: 'reserved',
    payments: [],
    _id: '63a57e9a9c97c2505d0b0406',
  },
  {
    name: 'Postavy - Minsk',
    type: 'road',
    points: [],
    dateTimeStart: '2022-12-29T09:30:37.287Z',
    dateTimeEnd: '2022-12-29T12:00:00.683Z',
    transportType: 'bus',
    serviceProvider: {
      name: '???',
    },
    status: 'to_find',
    payments: [
      {
        name: 'approx',
        price: {
          amount: 12,
          currency: 'EUR',
        },
        _id: '63a5840e9c97c2505d0b0739',
      },
    ],
    _id: '63a57ed79c97c2505d0b041e',
  },
  {
    name: 'Minsk Parents',
    type: 'stay',
    points: [],
    dateTimeStart: '2022-12-29T18:00:47.474Z',
    dateTimeEnd: '2022-12-30T19:00:14.474Z',
    placementType: 'flat',
    status: 'reserved',
    payments: [],
    _id: '63a57f389c97c2505d0b0439',
    serviceProvider: null,
  },
  {
    name: 'Minsk - Warsaw',
    type: 'road',
    points: [],
    dateTimeStart: '2022-12-30T20:00:46.220Z',
    dateTimeEnd: '2022-12-31T06:00:05.220Z',
    transportType: 'bus',
    serviceProvider: {
      name: 'Intercars',
    },
    status: 'bought',
    payments: [
      {
        name: 'Common',
        link: 'https://drive.google.com/file/d/1QJHjDwDl43cq3CPzXT6vt7lc4xH5TMoX/view?usp=share_link',
        price: {
          amount: 70,
          currency: 'EUR',
        },
        _id: '63a57fa49c97c2505d0b0462',
      },
    ],
    _id: '63a57fa49c97c2505d0b0461',
  },
  {
    name: 'Warsaw - Budapest',
    type: 'road',
    points: [],
    dateTimeStart: '2022-12-31T15:15:37.497Z',
    dateTimeEnd: '2022-12-31T16:40:42.497Z',
    transportType: 'aircraft',
    serviceProvider: {
      name: 'WizzAir',
    },
    status: 'bought',
    payments: [
      {
        name: 'Tickets',
        price: {
          amount: 52,
          currency: 'EUR',
        },
        _id: '63a581cc9c97c2505d0b0548',
      },
    ],
    notes: 'Tickets in the app; Need to check-in!!',
    _id: '63a580399c97c2505d0b04a9',
  },
  {
    name: 'Budapest hotel',
    type: 'stay',
    points: [],
    dateTimeStart: '2022-12-31T18:20:42.677Z',
    dateTimeEnd: '2023-01-04T07:00:16.677Z',
    placementType: 'hotel',
    serviceProvider: {
      name: 'Triple M',
      link: '',
    },
    status: 'reserved',
    payments: [
      {
        name: 'Booking',
        // eslint-disable-next-line max-len
        link: 'https://secure.booking.com/confirmation.en-gb.html?aid=1250365&sid=0ab847d431d6c8e3a0ba6ddb83f0f5a4&auth_key=cMpQEHYPTgDMKZ1o&source=mytrips&label=huno.1%253ACj0KCQiAwJWdBhCYARIsAJc4idDpkGJCop1-ZnRSD8P8E31zrSlpnI9JR1lEMrv-BKBaEnmED5AKLT8aAuCSEALw_wcB',
        price: {
          amount: 476,
          currency: 'EUR',
        },
        _id: '63a581469c97c2505d0b04eb',
      },
    ],
    notes: 'Need to Top-Up card before 26.12!!!',
    _id: '63a581469c97c2505d0b04ea',
  },
  {
    name: 'Budapest - Krakow',
    type: 'road',
    points: [],
    dateTimeStart: '2023-01-04T07:55:11.712Z',
    dateTimeEnd: '2023-01-04T15:25:49.712Z',
    transportType: 'bus',
    serviceProvider: {
      name: 'FlixBus',
    },
    status: 'bought',
    payments: [
      {
        name: 'Tickets',
        price: {
          amount: 75,
          currency: 'EUR',
        },
        _id: '63a581ba9c97c2505d0b0519',
      },
    ],
    notes: 'Tickets in the app',
    _id: '63a581ba9c97c2505d0b0518',
  },
  {
    name: 'Krakow hotel',
    type: 'stay',
    points: [],
    dateTimeStart: '2023-02-07T09:00:41.516Z',
    dateTimeEnd: '2023-02-08T13:30:59.516Z',
    placementType: 'hotel',
    serviceProvider: {
      name: 'Park Inn by Radisson Krakow',
      // eslint-disable-next-line max-len
      link: 'https://www.radissonhotels.com/pl-pl/hotele/park-inn-krakow?facilitatorId=RHGSEM&cid=a:ps+b:ggl+c:emea+i:brand+e:pii+d:cese+r:brt+f:pl-PL+g:ho+h:PLKRK1+v:cf&gclid=Cj0KCQiAwJWdBhCYARIsAJc4idBk9-Ln0i4SC29MQExKAGj7lZ-iOuapjz-Cv8pAog0gEGddae9p1lIaAobMEALw_wcB&gclsrc=aw.ds',
    },
    status: 'reserved',
    payments: [
      {
        name: 'Booking',
        // eslint-disable-next-line max-len
        link: 'https://secure.booking.com/confirmation.en-gb.html?aid=1250365&sid=0ab847d431d6c8e3a0ba6ddb83f0f5a4&auth_key=HGP4qQZko9z3HbyZ&source=mytrips&label=huno.1%253ACj0KCQiAwJWdBhCYARIsAJc4idDpkGJCop1-ZnRSD8P8E31zrSlpnI9JR1lEMrv-BKBaEnmED5AKLT8aAuCSEALw_wcB',
        price: {
          amount: 97,
          currency: 'EUR',
        },
        _id: '63a5827d9c97c2505d0b05cb',
      },
    ],
    _id: '63a5827d9c97c2505d0b05ca',
  },
  {
    name: 'Krakow - Wroclaw',
    type: 'road',
    points: [],
    dateTimeStart: '2023-01-06T15:00:31.835Z',
    dateTimeEnd: '2023-01-06T19:05:07.835Z',
    transportType: 'unknown',
    status: 'to_find',
    payments: [
      {
        name: 'approx',
        price: {
          amount: 144,
          currency: 'PLN',
        },
        _id: '63a583e89c97c2505d0b06bf',
      },
    ],
    notes:
      'Intercity: 70 - 100 zl, 3-4 hours;\nFlixbus: 63. -180 zl, 3:15 - 3:40 h\n',
    _id: '63a582d49c97c2505d0b0642',
    serviceProvider: null,
  },
]

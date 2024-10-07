import { TripSummaryValues } from '@/types/types'

type SummaryItem = {
  label: string
  value: string | number
}

type SummaryToDisplay = {
  time: SummaryItem[]
  money: SummaryItem[]
}

export const getSummaryToDisplay = (
  summary?: TripSummaryValues
): SummaryToDisplay | null => {
  if (!summary) {
    return null
  }

  return {
    time: [
      {
        label: 'Time in the road',
        value: summary.roadTimeStr,
      },
      {
        label: 'Time in hotels',
        value: summary.stayTimeStr,
      },
      {
        label: 'Waiting time',
        value: summary.waitingTimeStr,
      },
      {
        label: 'Total time',
        value: summary.totalTimeStr,
      },
    ],
    money: [
      {
        label: 'Spent on the road',
        value: summary.roadCost,
      },
      {
        label: 'Spent on the stays',
        value: summary.stayCost,
      },
      {
        label: 'Spent total',
        value: summary.totalCost,
      },
    ],
  }
}

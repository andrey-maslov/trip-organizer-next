import { TripSummaryValues } from '@/types/types'

type SummaryItem = {
  label: string
  value: string | number
}

export const getSummaryToDisplay = (
  summary: TripSummaryValues | undefined,
  currency: string
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
        value: `${summary.roadCost} ${currency}`,
      },
      {
        label: 'Spent on the stays',
        value: `${summary.stayCost} ${currency}`,
      },
      {
        label: 'Spent total',
        value: `${summary.totalCost} ${currency}`,
      },
    ],
  }
}

type SummaryToDisplay = {
  time: SummaryItem[]
  money: SummaryItem[]
}

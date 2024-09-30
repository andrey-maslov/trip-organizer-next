import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import { SearchParams } from '@/types/types'

type UseQueryParamsReturn = {
  searchObj: SearchParams
  searchStr: string
  setQueryParams: (newSearchParamsObject: Record<string, any>) => void
  removeQueryParams: (paramNames?: string[]) => void
}

export const useQueryParams = (): UseQueryParamsReturn => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams() as unknown as URLSearchParams

  const searchObj = getSearchValues(searchParams)

  const setQueryParams = (
    newSearchParamsObject: Record<string, string | number>
  ) => {
    const newSearchParams = new URLSearchParams(searchParams)

    Object.entries(newSearchParamsObject).forEach(([name, value]) =>
      newSearchParams.set(name, value.toString())
    )
    router.push(pathname + '?' + newSearchParams.toString())
  }

  // To be improved
  const removeQueryParams = (paramNames?: string[]) => {
    if (!paramNames) {
      // clear all query
      router.push(pathname ?? '/')

      return
    }

    const newSearchParams = new URLSearchParams(searchParams)

    router.push(pathname + '?' + newSearchParams.toString())
  }

  return {
    searchObj,
    searchStr: searchParams.toString(),
    setQueryParams,
    removeQueryParams,
  }
}

// TODO check it, fallback values
function getSearchValues(
  search: ReadonlyURLSearchParams | URLSearchParams
): SearchParams {
  return {
    note: search.get('note') ?? '',
    fullscreen: search.get('fullscreen') ?? '',
  }
}

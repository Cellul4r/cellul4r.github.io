export const codeforcesProfile = {
  handle: 'Cellul4r',
  url: 'https://codeforces.com/profile/Cellul4r',
} as const

export const CODEFORCES_API = 'https://codeforces.com/api/'
export const SUBMISSION_PAGE_SIZE = 1000

export const formatDate = (seconds: number) => new Intl.DateTimeFormat(undefined, {
  day: 'numeric', month: 'short', year: 'numeric',
}).format(new Date(seconds * 1000))

export const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

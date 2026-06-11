// Jalali (Persian Solar Hijri) calendar conversion
// Algorithm based on Borkowski's work

const PERSIAN_MONTHS = [
  'Farvardin', 'Ordibehesht', 'Khordad',
  'Tir', 'Mordad', 'Shahrivar',
  'Mehr', 'Aban', 'Azar',
  'Dey', 'Bahman', 'Esfand',
]

const PERSIAN_MONTHS_FA = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند',
]

export function toJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_no = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400)
  const g_days = [0, 31, 28 + (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0) ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let dayNo = g_d_no + gd
  for (let i = 0; i < gm; i++) dayNo += g_days[i]

  const j_y_temp = Math.floor((dayNo - 79) / 12053)
  dayNo -= 12053 * j_y_temp
  const j_y = 979 + 33 * j_y_temp + 4 * Math.floor(dayNo / 1461)
  dayNo %= 1461

  let j_m: number, j_d: number
  if (dayNo >= 366) {
    const temp = Math.floor((dayNo - 1) / 365)
    dayNo -= 365 * temp
    const jy = j_y + temp
    const j_days = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    j_m = 1
    while (j_m <= 12 && dayNo > j_days[j_m]) { dayNo -= j_days[j_m]; j_m++ }
    j_d = dayNo
    return [jy, j_m, j_d]
  }

  const j_days = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
  j_m = 1
  while (j_m <= 12 && dayNo > j_days[j_m]) { dayNo -= j_days[j_m]; j_m++ }
  j_d = dayNo
  return [j_y, j_m, j_d]
}

export function gregorianToJalali(date: Date): { year: number; month: number; day: number; monthName: string; monthNameFa: string } {
  const [year, month, day] = toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return {
    year,
    month,
    day,
    monthName: PERSIAN_MONTHS[month - 1],
    monthNameFa: PERSIAN_MONTHS_FA[month - 1],
  }
}

export function formatJalali(date: Date, lang: 'en' | 'fa' = 'en'): string {
  const j = gregorianToJalali(date)
  if (lang === 'fa') return `${j.day} ${j.monthNameFa} ${j.year}`
  return `${j.day} ${j.monthName} ${j.year}`
}

export function getTodayBoth(): { gregorian: string; jalali: string; jalaliShort: string } {
  const now = new Date()
  const j = gregorianToJalali(now)
  const gregorian = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const jalali = `${j.day} ${j.monthName} ${j.year}`
  const jalaliShort = `${j.day} ${j.monthNameFa} ${j.year}`
  return { gregorian, jalali, jalaliShort }
}

// Returns today's date as YYYY-MM-DD using LOCAL time (not UTC)
// Critical for Iran (UTC+3:30): toISOString() gives UTC date which differs
// from local date during the first 3.5 hours of each day
export function getLocalToday(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

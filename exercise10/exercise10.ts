import { Component, OnInit } from '@angular/core';

type LunarDetail = {
  weekdayText: string;
  weekdayNumber: number;
  lunarDateText: string;
  yearCanChi: string;
  monthCanChi: string;
  dayCanChi: string;
};

type LunarDate = {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
};

class LunarYear {
  constructor(
    public day: number,
    public month: number,
    public calendarYear: number
  ) {}

  findLunarYearDetail(): LunarDetail {
    const solar = new Date(this.calendarYear, this.month - 1, this.day);
    const weekdayIndex = solar.getDay();
    const weekdayText = this.getWeekdayText(weekdayIndex);

    const lunar = convertSolar2Lunar(this.day, this.month, this.calendarYear, 7);
    const lunarDateText =
      `${lunar.day}/${lunar.month}/${lunar.year}` + (lunar.leap ? ' (Nhuận)' : '');

    return {
      weekdayText,
      weekdayNumber: weekdayIndex === 0 ? 8 : weekdayIndex + 1,
      lunarDateText,
      yearCanChi: this.getCanChiYear(lunar.year),
      monthCanChi: this.getCanChiMonth(lunar.year, lunar.month),
      dayCanChi: this.getCanChiDay(lunar.jd),
    };
  }

  private getWeekdayText(d: number): string {
    const map = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
    return map[d] ?? '';
  }

  private getCanChiYear(y: number): string {
    const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
    const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
    const can = CAN[(y + 6) % 10];
    const chi = CHI[(y + 8) % 12];
    return `${can} ${chi}`;
  }

  private getCanChiMonth(lunarYear: number, lunarMonth: number): string {
    const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
    const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
    const can = CAN[(lunarYear * 12 + lunarMonth + 3) % 10];
    const chi = CHI[(lunarMonth + 1) % 12];
    return `${can} ${chi}`;
  }

  private getCanChiDay(jd: number): string {
    const CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
    const CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
    const can = CAN[(jd + 9) % 10];
    const chi = CHI[(jd + 1) % 12];
    return `${can} ${chi}`;
  }
}

/* Solar to Lunar converter */
const PI = Math.PI;
function INT(d: number): number { return Math.floor(d); }

function jdFromDate(dd: any, mm: any, yy: any): number {
  dd = Number(dd);
  mm = Number(mm);
  yy = Number(yy);

  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;

  let jd =
    dd +
    INT((153 * m + 2) / 5) +
    365 * y +
    INT(y / 4) -
    INT(y / 100) +
    INT(y / 400) -
    32045;

  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function NewMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;

  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3;

  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M) -
    0.4068 * Math.sin(Mpr * dr) +
    0.0161 * Math.sin(dr * 2 * Mpr) -
    0.0004 * Math.sin(dr * 3 * Mpr) +
    0.0104 * Math.sin(dr * 2 * F) -
    0.0051 * Math.sin(dr * (M + Mpr)) -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M)) -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr)) +
    0.0010 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (2 * Mpr + M));

  let deltat: number;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }

  return Jd1 + C1 - deltat;
}

function SunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;

  const M =
    357.52910 +
    35999.05030 * T -
    0.0001559 * T2 -
    0.00000048 * T * T2;

  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  const DL =
    (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) +
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.000290 * Math.sin(dr * 3 * M);

  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return L;
}

function getSunLongitude(dayNumber: number, timeZone: number): number {
  return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI) * 6);
}

function getNewMoonDay(k: number, timeZone: number): number {
  return INT(NewMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

function convertSolar2Lunar(dd: any, mm: any, yy: any, timeZone = 7): LunarDate {
  dd = Number(dd);
  mm = Number(mm);
  yy = Number(yy);

  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);

  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = true;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap, jd: dayNumber };
}


@Component({
  selector: 'app-exercise10',
  standalone: false,
  templateUrl: './exercise10.html',
  styleUrl: './exercise10.css',
})
export class Exercise10Component implements OnInit {
  days: number[] = [];
  months: number[] = [];
  years: number[] = [];

  selectedDay = 1;
  selectedMonth = 1;
  selectedYear = new Date().getFullYear();

  result: LunarDetail | null = null;

  ngOnInit(): void {
    this.months = Array.from({ length: 12 }, (_, i) => i + 1);
    this.years = Array.from({ length: 101 }, (_, i) => 1950 + i);

    this.refreshDays();
    this.convert();
  }

  refreshDays(): void {
    const max = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    this.days = Array.from({ length: max }, (_, i) => i + 1);
    if (this.selectedDay > max) this.selectedDay = max;
  }

  onMonthYearChange(): void {
    this.refreshDays();
  }

  convert(): void {
  const d = Number(this.selectedDay);
  const m = Number(this.selectedMonth);
  const y = Number(this.selectedYear);

  const model = new LunarYear(d, m, y);
  this.result = model.findLunarYearDetail();
}
}

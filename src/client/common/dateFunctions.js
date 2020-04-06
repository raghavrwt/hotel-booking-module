import {
    parse,
    setHours,
    setMinutes,
    toDate,
    compareAsc,
    addMinutes,
    format,
    addDays,
    setSeconds
} from 'date-fns';

export const serverDateFormat = `yyyy-MM-dd`;
export const serverDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss`;
export const displayDateTime = 'dd/MM/yyyy hh:mm aa';
export const cartServerFormat = 'yyyy-MM-dd HH:mm:ss';

export const intervalFormat = 'HH:mm';

export const getIntervalStr = (dateObj) => format(dateObj, intervalFormat);

export const formatCartDate = str => {
    const obj = parse(str.substring(0, str.indexOf('.')), serverDateTimeFormat, new Date());
    return format(obj, displayDateTime)
};

export const getSlotsList = ({ start, end, interval, date = '' }) => {
    const dateObj = date;//parse(date, serverDateFormat, new Date());
    const [hh, mm] = start.split(':');
    const [ehh, emm] = end.split(':');
    const startDate = setMinutes(setHours(dateObj, Number(hh)), Number(mm));
    const endDate = setMinutes(setHours(dateObj, Number(ehh)), Number(emm));
    const slotList = [];

    if (compareAsc(endDate, startDate) <= 0) {
        return slotList;
    }

    let newDate = toDate(startDate);

    while (compareAsc(endDate, newDate) >= 0) {
        slotList.push(newDate);
        newDate = addMinutes(newDate, Number(interval));
    }

    return slotList;
}

export const getDateList = ({ start, days }) => {
    const list = [];
    let daysAdded = 0;

    start = setSeconds(setMinutes(setHours(start || new Date(), 0), 0), 0);

    let dateObj = toDate(start);

    while (daysAdded <= days) {
        list.push(dateObj);
        dateObj = addDays(dateObj, 1);
        daysAdded++;
    }

    return list;
}


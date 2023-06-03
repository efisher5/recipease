import { formatInTimeZone } from "date-fns-tz";

export const getDate = function(dateInput: string) {
    return formatInTimeZone(dateInput, 'America/New_York', 'MM/dd/yyyy');
}
export const combineDateAndTime = function (date: Date, timeString: string) {
    let parsedHours = Number.parseInt(timeString.split(':')[0]);
    let parsedMinutes = Number.parseInt(timeString.split(':')[1]);
    let newDate = new Date(date);
    newDate.setHours(parsedHours, parsedMinutes);
    return newDate;
};

export const addDays = (date: Date, days: number) => {
    const updatedDate = new Date(date);
    updatedDate.setDate(date.getDate() + days);
    return updatedDate;
};
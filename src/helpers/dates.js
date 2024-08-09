/**
 * Calculate the number of days between two dates
 * @param {*} stringDate1 
 * @param {*} stringDate2 
 * @returns 
 */
export const daysBetween = (stringDate1, stringDate2) => {
  if(!stringDate1 || !stringDate2) return "";
  console.log({stringDate1, stringDate2});
  const date1 = new Date(stringDate1);
  const date2 = new Date(stringDate2);
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  const differenceInTime = date1.getTime() - date2.getTime();
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetInDays = offsetInMinutes / 60 / 24;
  const differenceInDays = differenceInTime / (1000 * 3600 * 24) + offsetInDays;
  const result = Math.round(differenceInDays);
  return result < -10000 ? 0 : result;
};

/**
 * Format date to YYYY-MM-DD
 * @param {*} date 
 * @returns string
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formatDate = `${year}-${month}-${day}`;
  return formatDate;
};

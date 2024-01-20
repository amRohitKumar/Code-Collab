function convertUTCToDateMonthYear(utcString: Date) {
  const date = new Date(utcString);

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthsShort[date.getUTCMonth()];

  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  const formattedDate = `${day} ${monthName} ${year}`;

  return formattedDate;
}

export default convertUTCToDateMonthYear;

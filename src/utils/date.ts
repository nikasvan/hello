// All date related functions can be exported from here

export const shortDate = (d: Date | undefined): string => {
  if (!d) return 'N/A';
  const now = new Date();
  const millsecBetweenDates = Math.abs(d.getTime() - now.getTime());
  const hoursBetweenDates = millsecBetweenDates / (60 * 60 * 1000);

  if (hoursBetweenDates < 24) {
    const formattedDate = d.toLocaleTimeString('en-us', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateText = `Today at ${formattedDate}`;
    return dateText;
  } else {
    return d.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

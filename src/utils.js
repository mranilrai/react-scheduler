import moment from "moment";

// Function to calculate the earliest start date and latest end date
export function findMinStartAndMaxEnd(events) {
  // Convert dates to Date objects and handle events with duration
  const startDates = events.map((event) => new Date(event.startDate));
  const endDates = events
    .map((event) => {
      if (event.endDate) {
        return new Date(event.endDate);
      } else if (event.duration && event.durationUnit === "day") {
        // Calculate end date based on duration
        const endDate = new Date(event.startDate);
        endDate.setDate(endDate.getDate() + event.duration);
        return endDate;
      }
      return null;
    })
    .filter((date) => date !== null);

  // Find the minimum start date and maximum end date
  const minStart = new Date(Math.min(...startDates));
  const maxEnd = new Date(Math.max(...endDates));

  return { minStart, maxEnd };
}

// Function to generate an array of dates between minStart and maxEnd using moment.js
export function generateDateArray(minStart, maxEnd) {
  const start = moment(minStart);
  const end = moment(maxEnd);
  const dateObject = {};

  // Loop through each day from start to end
  while (start <= end) {
    const month = start.format("MMMM YYYY"); // e.g., "May 2018"
    const date = start.format("YYYY-MM-DD");

    // Initialize the array for the month if it doesn't exist
    if (!dateObject[month]) {
      dateObject[month] = [];
    }

    // Add the date to the array of the corresponding month
    dateObject[month].push(date);

    // Move to the next day
    start.add(1, "days");
  }

  return dateObject;
}

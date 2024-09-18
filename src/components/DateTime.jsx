import { useEffect } from "react";

const DateTime = () => {
  const formatDate = (datestring, isHeader) => {
    const date = new Date(datestring);
    const fullMonths = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (isHeader) {
      return `${day} ${fullMonths[month]} ${year}`;
    } else {
      const month = date.toDateString().split(" ", 2).pop();
      return `${day} ${month} ${year}`;
    }
  };

  const updateTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const dateString = formatDate(date, true);
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").textContent = timeString;
    document.getElementById("date").textContent = dateString;
  };

  useEffect(() => {
    updateTime();
    const timerId = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(timerId); // Clean up interval on component unmount
  }, []);

  return (
    <div className="time">
      <h4 id="date"></h4>
      <p id="clock"></p>
    </div>
  );
};

export default DateTime;

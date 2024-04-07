import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % allEvents.length);
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + allEvents.length) % allEvents.length
    );
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Sự kiện đang chạy</h1>
          </div>

          <div className="w-full grid">
            {allEvents.length > 0 ? (
              <div className="flex items-center">
                <EventCard
                  key={currentEventIndex}
                  data={allEvents[currentEventIndex]}
                />
                <IoIosArrowDropleftCircle
                  className="cursor-pointer p-2"
                  size={70}
                  onClick={handlePrevEvent}
                  style={{ width: "70px", height: "70px" }}
                />
                <IoIosArrowDroprightCircle
                  className="cursor-pointer p-2"
                  size={70}
                  onClick={handleNextEvent}
                  style={{ width: "70px", height: "70px" }}
                />
              </div>
            ) : (
              <h4>Hiện tại chưa có sự kiện nào!</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;

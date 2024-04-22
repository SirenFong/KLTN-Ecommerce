import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Loader from "../Layout/Loader";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [startIndex, setStartIndex] = useState(0);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const handleNext = () => {
    setStartIndex((prevIndex) => prevIndex + 5);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <h1>Sự kiện đang chạy</h1>
      </div>

      <div className="w-full grid gap-4">
        {allEvents && allEvents.length > 0 ? (
          <>
            <div className="flex items-stretch justify-around">
              {allEvents
                .slice(startIndex, startIndex + 5)
                .map((event, index) => (
                  <EventCard
                    key={event.id} // Add a unique key
                    data={event}
                    active={index === 0}
                  />
                ))}
            </div>
            {allEvents.length > 5 && (
              <div className="flex justify-center mt-4">
                {startIndex > 0 && (
                  <IconButton onClick={handlePrev}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                {startIndex + 5 < allEvents.length && (
                  <IconButton onClick={handleNext}>
                    <ArrowForwardIcon />
                  </IconButton>
                )}
              </div>
            )}
          </>
        ) : (
          <h4>Hiện tại chưa có sự kiện nào!</h4>
        )}
      </div>
    </div>
  );
};

export default Events;

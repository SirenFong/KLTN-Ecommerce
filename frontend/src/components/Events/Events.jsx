import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import {
  IconName,
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
                <motion.div
                  className="mr-5"
                  initial="hidden"
                  animate="visible"
                  variants={variants}
                  transition={{ duration: 1 }}
                >
                  <EventCard
                    key={currentEventIndex}
                    data={allEvents[currentEventIndex]}
                  />
                </motion.div>

                <IoIosArrowDropleftCircle
                  className="cursor-pointer"
                  size={70}
                  onClick={handlePrevEvent}
                />
                <IoIosArrowDroprightCircle
                  className="cursor-pointer"
                  size={70}
                  onClick={handleNextEvent}
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

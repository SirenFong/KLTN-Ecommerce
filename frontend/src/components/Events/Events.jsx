import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events); // Lấy tất cả sự kiện từ store
  const [currentEventIndex, setCurrentEventIndex] = useState(0); // Sự kiện hiện tại
  const [autoSlide, setAutoSlide] = useState(false); // Tự động chuyển đổi sự kiện

  useEffect(() => {
    if (allEvents && allEvents.length > 1 && !autoSlide) {
      // Nếu có nhiều hơn 1 sự kiện và không tự động chuyển đổi
      const timer = setInterval(() => {
        // Tự động chuyển đổi sự kiện
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % allEvents.length);
      }, 5000); // thời gian chuyển đổi tự động, ở đây là 5 giây
      return () => clearInterval(timer);
    }
  }, [autoSlide, allEvents]);

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % allEvents.length); // Chuyển đổi sự kiện tiếp theo
    setAutoSlide(false); // Dừng tự động chuyển đổi khi người dùng chọn sự kiện tiếp theo
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(
      (prevIndex) => (prevIndex - 1 + allEvents.length) % allEvents.length // Chuyển đổi sự kiện trước đó
    );
    setAutoSlide(false); // Dừng tự động chuyển đổi khi người dùng chọn sự kiện trước đó
  };

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Sự kiện đang chạy</h1>
          </div>

          <div className="w-full grid">
            {allEvents && allEvents.length > 0 ? (
              <div className="flex items-center">
                <EventCard
                  key={currentEventIndex} // Hiển thị sự kiện hiện tại
                  data={allEvents[currentEventIndex]} // Hiển thị thông tin sự kiện
                />
                {allEvents.length > 1 && (
                  <>
                    <IoIosArrowDropleftCircle
                      className="cursor-pointer p-1 "
                      // size={20}
                      onClick={handlePrevEvent}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <IoIosArrowDroprightCircle
                      className="cursor-pointer p-1"
                      // size={20}
                      onClick={handleNextEvent}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </>
                )}
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

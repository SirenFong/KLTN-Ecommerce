import React, { useState } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { BsArrowRight } from "react-icons/bs"; // Import the icon you want to use

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [visibleEvents, setVisibleEvents] = useState(3); // State to control the number of visible events

  const showMoreEvents = () => {
    setVisibleEvents(visibleEvents + 3); // Show 3 more events when the button is clicked
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />

          {allEvents &&
            allEvents.slice(0, visibleEvents).map((event, index) => (
              <div
                key={index}
                style={{ border: "1px solid black", margin: "10px" }}
              >
                <EventCard active={true} data={event} />
              </div>
            ))}
          {allEvents && allEvents.length > visibleEvents && (
            <button
              onClick={showMoreEvents}
              style={{ display: "flex", alignItems: "center" }}
            >
              Xem thêm <BsArrowRight />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;

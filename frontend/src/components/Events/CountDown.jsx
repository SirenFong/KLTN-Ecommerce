import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft()); // Tính thời gian còn lại

  useEffect(() => {
    // useEffect là một hook chạy sau lần render đầu tiên và sau mỗi lần update
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      // Nếu thời gian còn lại bằng 0 thì xóa sự kiện
      typeof timeLeft.Ngày === "undefined" &&
      typeof timeLeft.Giờ === "undefined" &&
      typeof timeLeft.Phút === "undefined" &&
      typeof timeLeft.Giây === "undefined"
    ) {
      axios.delete(`${server}/event/delete-shop-event/${data._id}`); // Xóa sự kiện
    }
    return () => clearTimeout(timer); // Xóa timer
  });

  function calculateTimeLeft() {
    // Tính thời gian còn lại
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      // Nếu thời gian còn lại lớn hơn 0
      timeLeft = {
        Ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Phút: Math.floor((difference / 1000 / 60) % 60),
        Giây: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft; // Trả về thời gian còn lại
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    // Hiển thị thời gian còn lại
    if (!timeLeft[interval]) {
      // Nếu thời gian còn lại bằng 0 thì không hiển thị
      return null;
    }

    return (
      // Hiển thị thời gian còn lại
      <span className="text-[25px] text-[#475ad2]">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? ( // Nếu timerComponents có độ dài thì hiển thị timerComponents
        timerComponents
      ) : (
        // Nếu không hiển thị Kết thúc
        <span className="text-[red] text-[25px]">Kết thúc</span>
      )}
    </div>
  );
};

export default CountDown;

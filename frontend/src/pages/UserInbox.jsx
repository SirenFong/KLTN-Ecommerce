/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useDispatch, useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
import { Avatar, Box, Typography, makeStyles } from "@material-ui/core";
// const ENDPOINT = "https://socket-ecommerce-tu68.onrender.com/"; // Server socket  (https://socket-ecommerce-tu68.onrender.com/)
const ENDPOINT = "https://kltn-ecommerce-socket.onrender.com/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] }); // Kết nối socket với server

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);

  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Lấy tin nhắn mới
    socketId.on("getMessage", (data) => {
      // Lắng nghe sự kiện getMessage
      setArrivalMessage({
        // Cập nhật tin nhắn mới
        sender: data.senderId, // Người gửi
        text: data.text, // Nội dung tin nhắn
        createdAt: Date.now(), // Thời gian gửi
      });
    });
    const interval = setInterval(() => {
      dispatch(setArrivalMessage(user._id));
    }, 5000); //Lấy danh sách đơn hàng mỗi 5s
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, user._id]);

  useEffect(() => {
    // Kiểm tra tin nhắn mới
    arrivalMessage && // Nếu có tin nhắn mới
      currentChat?.members.includes(arrivalMessage.sender) &&
      // Và người gửi có trong cuộc trò chuyện hiện tại thì thêm vào danh sách tin nhắn mới của cuộc trò chuyện
      setMessages((prev) => [...prev, arrivalMessage]); // Thêm tin nhắn mới vào danh sách tin nhắn
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      // Lấy danh sách cuộc trò chuyện của người dùng
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations); // Cập nhật danh sách cuộc trò chuyện của người dùng
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      // Nếu người dùng đã đăng nhập thì thêm người dùng vào danh sách người dùng online
      const sellerId = user?._id; // Lấy id người dùng
      socketId.emit("addUser", sellerId); // Thêm người dùng vào danh sách người dùng online
      socketId.on("getUsers", (data) => {
        // Lắng nghe sự kiện getUsers
        setOnlineUsers(data); //  Cập nhật danh sách người dùng online
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    // Kiểm tra người dùng online trong cuộc trò chuyện
    const chatMembers = chat.members.find((member) => member !== user?._id); // Lấy id người dùng trong cuộc trò chuyện
    const online = onlineUsers.find((user) => user.userId === chatMembers); // Kiểm tra người dùng online

    return online ? true : false; // Trả về true nếu người dùng online, ngược lại trả về false
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      // Lấy danh sách tin nhắn của cuộc trò chuyện
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}` // Lấy danh sách tin nhắn theo id cuộc trò chuyện
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // Gửi tin nhắn
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      // Tạo tin nhắn mới với nội dung và người gửi
      sender: user._id, // Người gửi
      text: newMessage, // Nội dung tin nhắn
      conversationId: currentChat._id, // Id cuộc trò chuyện của tin nhắn
    };
    const receiverId = currentChat.members.find(
      // Lấy id người nhận tin nhắn trong cuộc trò chuyện
      (member) => member !== user?._id // Lấy id người nhận tin nhắn trong cuộc trò chuyện hiện tại
    );

    socketId.emit("sendMessage", {
      // Gửi tin nhắn mới thông qua socket với người nhận
      senderId: user?._id, // Người gửi tin nhắn mới là người dùng hiện tại
      receiverId, // Người nhận tin nhắn mới là người nhận trong cuộc trò chuyện
      text: newMessage, // Nội dung tin nhắn mới là nội dung tin nhắn
    });

    try {
      if (newMessage !== "") {
        // Nếu nội dung tin nhắn không rỗng thì gửi tin nhắn
        await axios
          .post(`${server}/message/create-new-message`, message) // Gửi tin nhắn mới thông qua api
          .then((res) => {
            setMessages([...messages, res.data.message]); // Thêm tin nhắn mới vào danh sách tin nhắn của cuộc trò chuyện
            updateLastMessage(); // Cập nhật tin nhắn cuối cùng của cuộc trò chuyện
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    // Cập nhật tin nhắn cuối cùng của cuộc trò chuyện khi gửi tin nhắn
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage, // Tin nhắn cuối cùng là tin nhắn mới gửi
      lastMessageId: user._id, // Id người gửi tin nhắn cuối cùng
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        // Cập nhật tin nhắn cuối cùng của cuộc trò chuyện thông qua api
        lastMessage: newMessage, // Tin nhắn cuối cùng là tin nhắn mới gửi
        lastMessageId: user._id, // Id người gửi tin nhắn cuối cùng
      })
      .then((res) => {
        setNewMessage(""); // Xóa nội dung tin nhắn sau khi gửi
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    // Xử lý upload ảnh trong tin nhắn
    const reader = new FileReader(); // Đọc file ảnh từ máy người dùng

    reader.onload = () => {
      // Khi đọc file ảnh thành công thì thực hiện
      if (reader.readyState === 2) {
        // Nếu file ảnh đã được đọc thành công
        setImages(reader.result); // Cập nhật ảnh vào state images để hiển thị
        imageSendingHandler(reader.result); // Gửi ảnh thông qua hàm imageSendingHandler để lưu vào database
      }
    };

    reader.readAsDataURL(e.target.files[0]); // Đọc file ảnh từ máy người dùng khi người dùng chọn file ảnh
  };

  const imageSendingHandler = async (e) => {
    // Gửi ảnh trong tin nhắn mới
    const receiverId = currentChat.members.find(
      // Lấy id người nhận tin nhắn trong cuộc trò chuyện
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      // Gửi tin nhắn mới thông qua socket với người nhận
      senderId: user._id, // Người gửi tin nhắn mới là người dùng hiện tại
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage(); // Cập nhật tin nhắn cuối cùng của cuộc trò chuyện khi gửi ảnh
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    // Cập nhật tin nhắn cuối cùng của cuộc trò chuyện khi gửi ảnh
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo", // Tin nhắn cuối cùng là ảnh
        lastMessageId: user._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" }); // Cuộn xuống cuối danh sách tin nhắn khi có tin nhắn mới
  }, [messages]);

  return (
    <div className="w-full">
      {!open && (
        <>
          <Header />
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            Tin nhắn
          </h1>

          {conversations &&
            conversations.map(
              (
                item,
                index // Hiển thị danh sách cuộc trò chuyện
              ) => (
                <MessageList
                  data={item}
                  key={index}
                  index={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={user?._id}
                  setUserData={setUserData}
                  userData={userData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                  loading={loading}
                />
              )
            )}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  // Hiển thị danh sách cuộc trò chuyện của người dùng với người bán
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data, setActiveStatus, online]);
  // Lấy thông tin người bán khi cuộc trò chuyện thay đổi

  const userName = useMemo(() => {
    if (!loading && data?.lastMessageId !== userData?._id) {
      return "You";
    } else {
      return userData?.name.split(" ")[0];
    }
  }, [loading, data, userData]);

  const useStyles = makeStyles((theme) => ({
    conversationItem: {
      width: "100%",
      display: "flex",
      padding: theme.spacing(1.5),
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: theme.palette.grey[200], // Màu nền khi hover
      },
    },
    onlineIndicator: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      backgroundColor: theme.palette.success.main,
      borderRadius: "50%",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  const handleItemClick = () => {
    setActive(index);
    handleClick(data._id);
    setCurrentChat(data);
    setUserData(user);
    setActiveStatus(online);
  };

  return (
    <div
      className={`${classes.conversationItem} ${
        active === index ? "bg-[#2427f410]" : "bg-transparent"
      }`}
      onClick={handleItemClick}
    >
      <Avatar src={user?.avatar?.url} alt={user?.name} />
      {online ? (
        <div className={classes.onlineIndicator} />
      ) : (
        <div
          className={classes.onlineIndicator}
          style={{ backgroundColor: "#c7b9b9" }}
        />
      )}
      <Box ml={2}>
        <Typography variant="h6">{user?.name}</Typography>
        <Typography variant="body1" color="textSecondary">
          {`${userName}: ${data?.lastMessage}`}
        </Typography>
      </Box>
    </div>
  );
};

const SellerInbox = ({
  // Hiển thị cuộc trò chuyện giữa người dùng và người bán hàng
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="w-[full] min-h-full flex flex-col justify-between p-5">
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>
      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages && // Hiển thị danh sách tin nhắn giữa người dùng và người bán hàng
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && ( // Hiển thị tin nhắn của người dùng với người bán
                <img
                  src={`${userData?.avatar?.url}`}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              {item.images && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  src={`${item.images?.url}`}
                  className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2"
                />
              )}
              {item.text !== "" && (
                <div>
                  <div
                    className={`w-max p-2 rounded ${
                      item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                    } text-[#fff] h-min`}
                  >
                    <p>{item.text}</p>
                  </div>

                  <p className="text-[12px] text-[#000000d3] pt-1">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;

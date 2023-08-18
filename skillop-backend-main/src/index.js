const connectDB = require("./db/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const notificationRoute = require("./routes/notification");
const mentorRoute = require("./routes/mentor");
const chats = require("./routes/chatRoutes");
const message = require("./routes/messageRoutes");

// Only for development
require("dotenv").config();

const app = express();
const PORT = process.env.PORT | 4000;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", postRoute);
app.use("/api", userRoute);
app.use("/api", notificationRoute);
app.use("/api", mentorRoute);
app.use("/chat", chats);
app.use("/message", message);

// share images in uploads/pubic to frontend
app.use("/api/public/posts", express.static("src/uploads/public/posts"));
app.use("/api/public/users", express.static("src/uploads/public/users"));

app.listen(PORT, () => {
  console.log("🔥 Server is running at PORT, ", PORT);
});

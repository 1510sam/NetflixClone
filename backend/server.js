const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");

const app = express();
const PORT = 8800;
dotenv.config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("Error existed: ", err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);

app.listen(8800, () => {
  console.log(`Listening on port ${PORT}`);
});

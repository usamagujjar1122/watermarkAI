const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require('./Routes/userRoutes')
const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoutes);

// mongoose
//   .connect("mongodb://0.0.0.0:27017/watermark", { useNewUrlParser: true })
//   .then(() => {
//     console.log("db connected");
//   });
// mongoose.set("strictQuery", false);
mongoose.connect("mongodb://admin:admin@ac-qex2e9m-shard-00-00.bchklen.mongodb.net:27017,ac-qex2e9m-shard-00-01.bchklen.mongodb.net:27017,ac-qex2e9m-shard-00-02.bchklen.mongodb.net:27017/?ssl=true&replicaSet=atlas-bj2w46-shard-0&authSource=admin&retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,})
    .then((err)=>{console.log("connected")})


app.listen(PORT, function () {
  console.log("app running on 5000");
});

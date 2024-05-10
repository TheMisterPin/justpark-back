import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routes/router";

const app = express();
app.use(cors({ credentials: true }));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", router);

const server = http.createServer(app);
const port = process.env.PORT;
server.listen(port, () => {
  console.log("Server Running on port " + port);
});

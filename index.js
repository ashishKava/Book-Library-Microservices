import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./src/database/database.js";
import routes from "./src/routes/routes.js";

connectDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/v1", routes);

app.listen(port, () => {
    console.log(`server is running on post ${port}`)
});

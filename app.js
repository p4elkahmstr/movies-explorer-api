require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors } = require("celebrate");
const cors = require("cors");
const auth = require("./middlewares/auth");
const NotFoundError = require("./errors/NotFoundError");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/bitfilmsdb" } =
  process.env;

const app = express();

const corsOptions = {
  origin: [
    "http://movies.diploma.nomoredomainsrocks.ru",
    "https://movies.diploma.nomoredomainsrocks.ru",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(limiter);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use(require("./routes/auth"));

app.use(auth);

app.use(require("./routes/users"));
app.use(require("./routes/movies"));

app.use(errorLogger);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { MONGO_URL, PORT } = require('./utils/config');
const limiter = require('./middlewares/limiter');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
// app.use(cors({
//   origin: ['http://localhost:3001',
//     'http://localhost:3000',
//     // 'https://api-krylatka.nomoredomains.rocks',
//     // 'http://api-krylatka.nomoredomains.rocks',
//     // 'https://krylatka.nomoredomains.rocks',
//     // 'http://krylatka.nomoredomains.rocks'
//   ],
//   credentials: true,
//   preflightContinue: false,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
//   optionsSuccessStatus: 204,
// }));

app.use(helmet());

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаем мидлвары, роуты и всё остальное...
app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app слушает порт: ${PORT}`);
});

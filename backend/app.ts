import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";
import { errorHandler } from './app/middlewares/errorHandler';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;

const allowedOrigins = [
  process.env.BACKOFFICE,
  process.env.FRONTA,
  process.env.FRONTB,
];

// Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Sécurité avec helmet (CSP désactivé pour éviter les conflits si tu injectes du contenu dynamique)
// app.use(helmet({
//   contentSecurityPolicy: false,
// }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});

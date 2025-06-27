import express from 'express';
import routes from './app/routes/index';
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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://js.stripe.com", 
          "'unsafe-inline'" // utile si tu injectes du JS dans tes templates EJS (à désactiver si possible)
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"], // autoriser les images locales et base64
        connectSrc: ["'self'", "https://api.stripe.com"], // Stripe API
        frameSrc: ["'self'", "https://js.stripe.com"], // pour les iframes Stripe
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});

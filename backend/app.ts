import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";
import { errorHandler } from './app/middlewares/errorHandler';
import cors from 'cors';

const app = express()
const PORT = 3000;

app.use(cors());


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes);

// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   errorHandler(err, req, res, next);
// });
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
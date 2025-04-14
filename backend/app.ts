import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";
import { errorHandler } from './app/middlewares/errorHandler';


const app = express()
const port = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes);

// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   errorHandler(err, req, res, next);
// });
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
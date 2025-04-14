import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";
import cors from 'cors';
//import { errorHandler } from './app/middlewares/errorHandler';

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(routes);
//app.use(errorHandler);

app.listen(port, () => {
   console.log(`Example app listening on port http://localhost:${port}`)
 })
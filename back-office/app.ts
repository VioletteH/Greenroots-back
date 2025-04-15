import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";
import cors from 'cors';
import methodOverride from 'method-override';
//import { errorHandler } from './app/middlewares/errorHandler';

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(routes);
//app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`Example app listening on port http://localhost:${PORT}`)
 });
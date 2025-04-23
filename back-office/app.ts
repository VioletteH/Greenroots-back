import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";
import cors from 'cors';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';

import { isLogged } from './app/middleware/isLogged';
//import { errorHandler } from './app/middlewares/errorHandler';

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.static('public'));
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(routes);
//app.use(errorHandler);

app.use(isLogged);

app.listen(PORT, () => {
   console.log(`Example app listening on port http://localhost:${PORT}`)
 });
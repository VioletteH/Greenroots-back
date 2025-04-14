import express from 'express';
import routes from './app/routes/index';

const app = express()
const port = 3001;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(routes);

app.listen(port, () => {
   console.log(`Example app listening on port http://localhost:${port}`)
 })
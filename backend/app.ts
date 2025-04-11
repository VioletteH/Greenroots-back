import express from 'express';
import routes from './app/routes/index';
import "dotenv/config";


const app = express()
const port = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
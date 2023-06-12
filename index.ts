import express from "express"
import 'dotenv/config'

const app = express()
const port = process.env.PORT
const domain = process.env.DOMAIN

app.get('/', (req, res) => {
  res.send('Hi!')
})

app.listen(port, () => {
  console.log(`⚡Server is running on ${domain}:${port}`);
});

console.clear()
console.log('************** START *******************')

import express from "express";
import dotenv from 'dotenv';

dotenv.config();
const { APP_LOCALHOST : hostname, APP_PORT: port, APP_TOKEN: secret } = process.env;
const app = express();

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res)=> {

  res.json({ message : "Hello World" });
})

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});

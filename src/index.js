import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import fs from 'fs'
import cors from 'cors'
import * as dotenv from 'dotenv'
dotenv.config()
import { checkAuth } from './utils/index.js'
import { getFileStream, s3Storage } from './s3Storage.js'
import serverRouter from './routes/servers.js'
import productRouter from './routes/products.js'
import authRouter from './routes/auth.js'
import navigationRouter from './routes/navigation.js'

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log('DB error', err))

export const app = express()
app.use(cors())
app.use(express.json()) // чтение json данных
app.set('json spaces', 2)

// local storage
// const storage = multer.diskStorage({
//   // создание хранилища изображений
//   destination: (_, __, cb) => {
//     if (!fs.existsSync('uploads')) {
//       // путь сохранения изображений
//       fs.mkdirSync('uploads')
//     }
//     cb(null, 'uploads')
//   },
//   filename: (_, file, cb) => {
//     cb(null, file.originalname) // имя сохранённого файла
//   },
// })
// /local storage

// AWS storage
const storage = multer.memoryStorage()

app.get('/uploads/:key', (req, res) => {
  const readStream = getFileStream(req.url)
  res.append('Content-Type', 'image/jpeg')
  return readStream.pipe(res)
})
// /AWS storage

const upload = multer({ storage }) // соединяем хранилище с multer
app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
  const result = await s3Storage(req.file) // S3 storage
  return res.json({ url: `/uploads/${req.file.originalname}`, result }) // S3 storage
  //return res.json({ url: `/uploads/${req.file.originalname}` }) // local storage
})

app.use('/uploads', express.static('uploads'))

app.listen(process.env.PORT || 4444, (err) => {
  if (err) console.warn(err)
  console.log('Server started...')
})

app.use(serverRouter)
app.use(productRouter)
app.use(authRouter)
app.use(navigationRouter)

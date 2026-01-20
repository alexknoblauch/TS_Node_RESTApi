import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import limiter from './lib/express_rate_limit'
import cookieParser from 'cookie-parser'

import v1Router from '@/routes/v1/index'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors({ }))
app.use(express.json())
app.use(express.urlencoded())
app.use(helmet)
app.use(limiter)
app.use(cookieParser())
app.use()
app.use('/', v1Router)
app.use(errorHandler)

app.listen(8000, () => {
    console.log('app listening at port 8000')
})
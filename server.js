import path from 'path'

import express from 'express'
import cookieParser from 'cookie-parser'

//* Express Config
const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

////////////////////////////////////////////////////

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`Serfver listening on port http://127.0.0.1:${port}/`))
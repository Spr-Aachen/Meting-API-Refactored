import { createServer } from 'node:http'
import getRequestListener from './api/index.js'


const port = parseInt(process.env.PORT || '3000')

const server = createServer(getRequestListener)

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
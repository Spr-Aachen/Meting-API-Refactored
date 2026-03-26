import { createServer } from 'node:http'
import { createRequire } from 'node:module'


const require = createRequire(import.meta.url)
const getRequestListener = require('./api/index.js').default

const port = parseInt(process.env.PORT || '3000')

const server = createServer(getRequestListener)

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
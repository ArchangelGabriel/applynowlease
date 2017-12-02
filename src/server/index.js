import './env'
import server from './server'
import { connect } from './db'
import { PORT } from './config'

const db = connect()

server.listen(PORT, () => {
  console.log(`Server is now running at PORT: ${PORT}`)
})
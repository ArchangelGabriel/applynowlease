import server from './server'
import { connect } from './db'

const PORT = 3000
const db = connect()

server.listen(PORT, () => {
  console.log(`Server is now running at PORT: ${PORT}`)
})
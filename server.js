
const app = require('./api')
const db = require('./db')

const port = process.env.PORT || 3003

db.connect() 

app.listen(port, () => console.log(`We are listening to port: ${port}`)) 
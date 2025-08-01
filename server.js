const express = require('express')
const app = express()
const port = 3000
const routesIndex=require('./routes/index')

app.use(express.json())

app.use('/api/v1/',routesIndex)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
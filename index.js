const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')

const userRoute = require('./routes/UserRoutes') //

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.send('Selamat datang di API ku')
})

app.use('/api/user', userRoute) //

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
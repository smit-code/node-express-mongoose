const mongoose = require('mongoose')

const mongoUrl = process.env.MONGO_URL

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database Connected')
  })
  .catch((err) => {
    console.log(err)
  })

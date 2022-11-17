const mongoose = require('mongoose')

// This is async because mongoose functions return promises
const connectDB = async () => {
    conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB
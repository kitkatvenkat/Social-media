const express =require("express")
const mongoose = require("mongoose")
const dotenv =require("dotenv")

const app = express()

dotenv.config()
app.use(express.json())

mongoose.connect(process.env.DB).then(()=>{
    console.log("Connected to MongoDB")
}).catch(()=>{
    console.log("Failed to connect to MongoDB")
})



app.listen(process.env.port,()=>{
    console.log(`Server running on port ${process.env.port}`)
})
const express =require("express")
const mongoose = require("mongoose")
const dotenv =require("dotenv")
const cors = require("cors")
const authRoutes = require("./Router/authRoutes");
const postRoutes = require("./Router/postRoutes");

const app = express()

dotenv.config()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);


mongoose.connect(process.env.DB).then(()=>{
    console.log("Connected to MongoDB")
}).catch(()=>{
    console.log("Failed to connect to MongoDB")
})



app.listen(process.env.port,()=>{
    console.log(`Server running on port ${process.env.port}`)
})
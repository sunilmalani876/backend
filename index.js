const { urlencoded } = require("body-parser");
const cors = require("cors")
const dotenv = require("dotenv")
const express = require("express");
const { dbConnect } = require("./db/dbConnect");
const app = express();

dotenv.config({path:"./secret.env"})
app.use(cors({}))
app.use(urlencoded({extended:true}))

dbConnect()

app.get("/",(req,res)=>{
    res.status(200).send({message:"HOME PAGE", statusCode:200})
})

// routes will come here  




// routes will end here


app.listen(process.env.PORT,()=>{console.log(`server running on port : ${process.env.PORT?process.env.PORT:""}`);})
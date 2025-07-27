import express from 'express'
import cors from 'cors'
import warn from './controllers/logger.js'


const app = express()
const port = process.env.PORT||3000

app.use(cors())

//User Routes


app.get('/',(req, res)=>{
    try{
        res.send("Hello How are you?")
    }
    catch(err)
    {
        warn("Something Went Wrong "+err)
    }
})

app.route("")
app.listen(port,(msg)=>{
    console.log(`server running on port ${port}`)
})
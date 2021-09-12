const express = require('express');
const cors = require('cors');
const dotenv =require('dotenv');
dotenv.config()
require('./db/mongoose')
const userRouter = require('./routers/user')
const facilityRouter = require('./routers/facility');
const feedbackRouter = require('./routers/feedback');
const AdminRouter = require('./routers/admin');
const CategoryRouter = require('./routers/category');
const ContactRouter = require('./routers/contact');


const rateLimiter = require('./middleware/rate-limit');


const app = express()
app.use(cors());
//app.use(express.urlencoded());
app.use('/public', express.static('public'))
const port = process.env.PORT || 8081

const http =require('http');
const server = http.createServer(app);
const socket = require('socket.io')


const io = socket(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  app.set('io',io);

io.on("connection",  (socket)=> {
  console.log("Made socket connection");
  socket.emit('hello',{greet:'hello react'})
});


app.use(express.json())
//app.use(rateLimiter)
app.use(userRouter)
app.use(AdminRouter)
app.use(facilityRouter)
app.use(feedbackRouter)
app.use(CategoryRouter)
app.use(ContactRouter)





// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })



server.listen(port, () => {
    console.log('Server is up on port ' + port)
  
})


import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import models from './models.js'
import session from 'express-session'
import cors from 'cors'
import { default as connectMongoDBSession} from 'connect-mongodb-session';
//import { createOrder, createAcquisition, completeAcquisition,cancelAcquisition, logInspection, cancelOrder } from './transactions.js'

//import routers
import loginRouter from './routes/login.js'
import checkLoginRouter from './routes/checkLogin.js'
import ordersRouter from './routes/orders.js'
import productsRouter from './routes/products.js'

const app = express()

//configure environment variables
dotenv.config()
const dbUri = process.env.DB_URI
const PORT = process.env.PORT || 3000

//dbConnection
mongoose.connect(dbUri) //to do .. error handling

//populating mock data. a one time thing
models.Employee.find({}).then((data) =>{
    if(data.length === 0 ){
        populateMockData()
    }
})

// createOrder({fn:"Richard",ln:"Nzioki"},[{name:"sponge",quantity:50},{name:"camphor",quantity:20}]).then(()=>{
//     console.log("order made")
// })

//session store configuration
const MongoDBStore = connectMongoDBSession(session);
const sessionStore = new MongoDBStore({
    uri: dbUri,
    collection: 'sessions'
});

//session configuration
const sessionConfig = { 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { 
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
        secure: false,
        httpOnly: true,
     },
}

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session(sessionConfig))
app.use('/login', loginRouter)
app.use('/checklogin',checkLoginRouter)
app.use('/orders',ordersRouter)
app.use('/products',productsRouter)
app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`)
})

async function populateMockData(){
    //products
    new models.Product({
        name:"sponge",
        prize: 2000,
        quantity: 155
    }).save()
    
    new models.Product({
        name:"camphor",
        prize: 3000,
        quantity: 65
    }).save()
    
    new models.Product({
        name:"mahogany",
        prize: 30000,
        quantity: 15
    }).save()

    //users
    new models.Employee({
        firstName:"Peter",
        lastName: "Kioko",
        password: "123"
    }).save()

    new models.Employee({
        firstName:"Ronald",
        lastName: "Kamau",
        password: "123"
    }).save()

    new models.Employee({
        firstName:"Jacob",
        lastName: "Kaleli",
        password: "123"
    }).save()

    //customers
    new models.Customer({
        firstName:"Milton",
        lastName: "Mwirabua"
    }).save()

    new models.Customer({
        firstName:"Richard",
        lastName:"Nzioki"
    }).save()

    new models.Supplier({
        firstName:"Sasuke",
        lastName:"Kinama"
    }).save()

    new models.Supplier({
        firstName:"Kayla",
        lastName:"Kurgat"
    }).save()

    new models.Supplier({
        firstName:"Cynthia",
        lastName:"Kioni"
    }).save()
}

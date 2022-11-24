const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// fun part
app.use((req, res, next) => {
    console.log(req.path, "I am watching you.")
    next();
})

// middle wares
const corsOptions ={
    origin:'*', 
    credentials:true,    
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1rqmivg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// async function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     console.log(authHeader)
//     if(!authHeader){
//         return res.status(401).send({message: 'unauthorized access'});
//     }
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//         if(err){
//             return res.status(403).send({message: 'Forbidden access'});
//         }
//         req.decoded = decoded;
//         next();
//     })
// }


async function run() {
    try {
        const samsungCollection = client.db('Mobile').collection('samsung');
        
        
        app.get("/",(req,res)=>
        {
            res.send("I am watching. caught you")
        })

        app.get('/samsung',async(req,res)=>
        {
            const query = {};
            const cursor = samsungCollection.find(query);
            const cat1 = await cursor.toArray();
            res.send(cat1);
        })
        app.get('/samsung/:id',async(req,res)=>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = samsungCollection.find(query);
            const cat1 = await cursor.toArray();
            console.log(cat1)
            res.send(cat1);
        })
    }
    finally {

    }

}

run().catch(err => console.error(err));


app.listen(port, (req, res) => {
    console.log(` server running on ${port}`);
})
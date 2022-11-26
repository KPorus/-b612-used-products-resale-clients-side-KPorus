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
        const appleCollection = client.db('Mobile').collection('apple');
        const waltonCollection = client.db('Mobile').collection('walton');
        const userCollection = client.db('Mobile').collection('user');
        const userProductCollection = client.db('Mobile').collection('userProduct');
        
        
        app.get("/",(req,res)=>
        {
            res.send("I am watching. caught you")
        })


        // user profie 
        app.get("/user/:email",async(req,res)=>
        {
            const email = req.params.email;
            const query = { email }
            const result = await userCollection.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        // buyer user api

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === "Seller" });
        })

        app.post("/userProduct",async(req,res)=>
        {
            const userProduct = req.body;
            const result = await userProductCollection.insertOne(userProduct);
            res.send(result)
        })

        app.get("/userProduct/samsung",async(req,res)=>{
            const query = {brandName:"samsung"};
            const result = await userProductCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/userProduct/apple",async(req,res)=>
        {
            const query = {brandName:"apple"};
            const result = await userProductCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/userProduct/walton",async(req,res)=>
        {
            const query = {brandName:"walton"};
            const result = await userProductCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/userProduct/:email",async(req,res)=>
        {
            const email = req.params.email
            console.log(email)
            const query = {email};
            const result = await userProductCollection.find(query).toArray();
            res.send(result)
        })

        app.delete("/userProduct/:id",async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userProductCollection.deleteOne(filter);
            res.send(result);
        })
        // samsung
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
            const result =await samsungCollection.find(query).toArray();
            res.send(result);
        })

        //apple
        app.get('/apple',async(req,res)=>
        {
            const query = {};
            const apple = appleCollection.find(query);
            const cat2 = await apple.toArray();
            res.send(cat2);
        })

        app.get('/apple/:id',async(req,res)=>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const apple = appleCollection.find(query);
            const cat2 = await apple.toArray();
            console.log(cat2)
            res.send(cat2);
        })

        //walton
        app.get('/walton',async(req,res)=>
        {
            const query = {};
            const walton = waltonCollection.find(query);
            const cat3 = await walton.toArray();
            res.send(cat3);
        })

        app.get('/walton/:id',async(req,res)=>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const walton = waltonCollection.find(query);
            const cat3 = await walton.toArray();
            console.log(cat3)
            res.send(cat3);
        })
    }
    finally {

    }

}

run().catch(err => console.error(err));


app.listen(port, (req, res) => {
    console.log(` server running on ${port}`);
})
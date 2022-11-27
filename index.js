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


async function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        const samsungCollection = client.db('Mobile').collection('samsung');
        const appleCollection = client.db('Mobile').collection('apple');
        const waltonCollection = client.db('Mobile').collection('walton');
        const userCollection = client.db('Mobile').collection('user');
        const userProductCollection = client.db('Mobile').collection('userProduct');
        const ordersCollection = client.db('Mobile').collection('orders');

        // jwt
        app.post('/jwt', (req, res) =>{
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '14d'})
            res.send({token})
        })  

        
        app.get("/",(req,res)=>
        {
            res.send("I am watching. caught you")
        })


        // user profie 

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.get("/user/:email",async(req,res)=>
        {
            const email = req.params.email;
            const query = { email }
            const result = await userCollection.find(query).toArray()
            console.log(result)
            res.send(result)
        })

        // buyer user api 

        app.post("/orders",async(req,res)=>{
            const order = req.body
            console.log(order)
            const result = await ordersCollection.insertOne(order)
            res.send(result);
        })

        app.get("/orders/:email",async(req,res)=>
        {
            const email = req.params.email;
            const filter = {email};
            const result = await ordersCollection.find(filter).toArray()
            res.send(result)
        })

        app.delete("/orders/:id",verifyJWT,async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(filter);
            res.send(result);
        })

        // admin user api

        app.get("/users/admin/:email",async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === "Admin" });
        })

        app.get("/allProduct",async(req,res)=>{
            const query ={};
            const result = await userProductCollection.find(query).toArray();
            res.send(result)
        })

        app.get("/seller",async(req,res)=>{
            const query ={role:"Seller"};
            const user = await userCollection.find(query).toArray();
            res.send(user)
        })

        app.delete("/seller/:id",verifyJWT,async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(filter);
            res.send(result);
        })

        app.get("/buyer",async(req,res)=>{
            const query ={role:"Buyer"};
            const user = await userCollection.find(query).toArray();
            res.send(user)
        })

        app.delete("/buyer/:id",verifyJWT,async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(filter);
            res.send(result);
        })

        // seller user api

        app.get("/sellerOrder/:email",async(req,res)=>
        {
            const sellerEmail = req.params.email
            const filter = {sellerEmail}
            const result = await ordersCollection.find(filter).toArray()
            res.send(result)
        })


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

        app.delete("/userProduct/:id",verifyJWT,async(req,res)=>{
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

        app.get('/walton/:id',verifyJWT,async(req,res)=>
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
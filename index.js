const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8prwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    // tures collaction
    const turesCollaction = client.db("tour-management").collection("tours");
    const bookingCollaction = client.db("tour-management").collection("my-bookings");


    // tures post oparation
    app.post('/tours', async(req, res) => {
        const newTure = req.body
        const result = await turesCollaction.insertOne(newTure)
        res.send(result)
    })


    // my-bookings post oparation
    

    // tures get oparation
    app.get('/ture-limit', async(req, res) => {
        const result = await turesCollaction.find().limit(6).toArray()
        res.send(result)
    })
    // tures get oparation all cards
    app.get('/all-tures-cards', async(req, res) => {
        const result = await turesCollaction.find().toArray()
        res.send(result)
    })

    // ture details page
    app.get('/ture-details/:id', async(req, res) => {
        const id = req.params.id;
        const queary = {_id: new ObjectId(id)}
        const result = await turesCollaction.findOne(queary)
        res.send(result)
    })

    //my added  ture  page
    app.get('/myAdded-ture/:userEmail', async(req, res) => {
        const userEmail = req.params.userEmail;
        const queary = {userEmail}
        const result = await turesCollaction.find(queary).toArray()
        res.send(result)
    })


     // ture delede page
    app.delete('/ture-delete/:id', async(req, res) => {
        const id = req.params.id;
        const queary = {_id: new ObjectId(id)}
        const result = await turesCollaction.deleteOne(queary)
        res.send(result)
    })


    // ture put oparation 
    app.put('/update-ture/:id', async(req, res) => {
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
         const options = {upsert: true}
         const updateTure = req.body
         const updateDoc = {
            $set: updateTure
         }
         const result = await turesCollaction.updateOne(filter,updateDoc,options)
         res.send(result)
    })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);















app.get('/', (req, res) => {
  res.send('Welcome to TourMate Server! 🚀 Explore amazing tours with us.');
})

app.listen(port, () => {
  console.log(`TourMate server running on port ${port}`);
})

const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
require('dotenv').config()


const app = express()
const port = 4000

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnprp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("eventStudio").collection("events");
  const reviewCollection = client.db("eventStudio").collection("reviews");
  const orderCollection = client.db("eventStudio").collection("orders");


  app.post('/addOrder', (req, res)=>{
    const orderBody = req.body
    orderCollection.insertOne(orderBody)
    .than(response =>{
      console.log(response)
      res.send(response)
    }) 
  })

  app.get('/showOrders', (req, res) => {
    orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  });


  app.get('/service/:id', (req, res)=>{
    const serviceId = req.params.id;
    eventCollection.find({_id: ObjectID(serviceId)})
    .toArray((err, result)=>{
      console.log(err);
      res.send(result)
    })
  });


  app.post('/addReview', (req, res) =>{
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    reviewCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result);
        res.send(result.insertedCount > 0);
    })
  });

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  });

  
  app.post('/addEvent', (req, res) =>{
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result);
        res.send(result.insertedCount > 0);
    })
  });

  app.get('/products', (req, res) => {
    eventCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  });

  app.delete('/delete/:id', (req, res) =>{
    const serviceId = req.params.id
    eventCollection.deleteOne({_id:ObjectID(serviceId)})
    .then(response => {
      console.log(response)
      res.send(response.deletedCount > 0)
    })
  });


});



app.get('/', (req, res) => {
  res.send('Hello New Event World!')
})

app.listen(process.env.PORT || port)
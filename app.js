const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.fltsf.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
const port = 5000


client.connect(err => {
  const blogCollection = client.db("blogTown").collection("blog");

  app.post('/addBlog', (req, res) => {
      const title = req.body.title
      const content = req.body.content
      const image = req.body.image
      blogCollection.insertOne({title, content, image})
      .then(result => {
          res.send(result.insertedCount > 0)
      }) 
  })

  app.get('/allBlog', (req, res) => {
      blogCollection.find({})
      .toArray((err, documents) =>{
          res.send(documents)
      })
  })

  app.delete('/deleteBlog/:id', (req, res) => {
      const id = req.params.id
      blogCollection.deleteOne({_id: ObjectId(id)})
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })


});


const middleWare = [
    cors(),
    express.json()
]

// use middleware
app.use(middleWare)


app.get('/', (req, res) => {
    res.send('hello everyone')
})

app.listen(port, () => {
    console.log(`listenning to port ${port}`)
})
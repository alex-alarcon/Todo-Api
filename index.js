'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Todo = require('./models/todo')

const app = express()
const port = process.env.PORT || 3000
const DB = process.env.APP_CONFIG.db || 'c518098f5dc47219b22252ba94b26d5e'
const host = process.env.APP_CONFIG.hostString || '6a.mongo.evennode.com:27017,6b.mongo.evennode.com:27017'
const username = process.env.APP_CONFIG.user || 'c518098f5dc47219b22252ba94b26d5e'
const password = ''


app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/hola/:name', (req, res) => {
  res.send({
    message: `hola ${req.params.name}!`
  })  
})

app.get('/api/todo', (req, res) => {
  Todo.find({}, (err, todos) => {
    if(err) {
      return res.status(500).send({
        message: `Error getting the data! ${err}`
      })
    }
    
    if(!todos) {
      return res.status(404).send({
        message: `Elements not found`
      })  
    }
    
    res.status(200).send({ todos })  
  })
})

app.get('/api/todo/:todoId', (req, res) => {
  let todoId = req.params.todoId
  
  Todo.findById(todoId, (err, todo) => {
    if(err) {
      return res.status(500).send({
        message: `Error getting the data! ${err}`
      })
    }
    
    if(!todo) {
      return res.status(404).send({
        message: `Element not found`
      })  
    }
    
    res.status(200).send({ todo })
  })
})

app.post('/api/todo', (req, res) => {
  console.log('POST /api/todo')
  console.log(req.body)
  
  let todo = Todo()
  todo.description = req.body.description
  todo.state = req.body.state
  todo.createdAt = req.body.createdAt
  todo.updatedAt = req.body.updatedAt
  todo.completedAt = req.body.completedAt
  
  todo.save((err, todoStored) => {
    if(err) {
      res.status(500).send({
        message: `Error saving data! ${err}`
      })
      throw err
    }
    res.status(200).send({
      todo: todoStored
    })
  })
})

app.put('/api/todo/:todoId', (req, res) => {
  let todoId = req.params.todoId
  let update = req.body
  
  Todo.findByIdAndUpdate(todoId, update, (err, todoUpdated) => {
    if(err) {
      return res.status(500).send({
        message: `Error updating the data! ${err}`
      })
    }
    
    res.status(200).send({ todoUpdated })
  })
})

app.delete('/api/todo/:todoId', (req, res) => {
  let todoId = req.params.todoId
  
  Todo.findById(todoId, (err, todo) => {
    if(err) {
      return res.status(500).send({
        message: `Error deleting the data! ${err}`
      })
    }
    
    todo.remove(err => {
      if(err) {
        return res.status(500).send({
          message: `Error deleting the data! ${err}`
        })
      }
      
      res.status(200).send({
        message: `Todo have benn eiminated`
      })
    })
  })
})

//mongoose.connect('mongodb://localhost:27017/todos', (err, res) => {
mongoose.connect('mongodb://'+host+'/todos', (err, res) => {
  if(err) throw err
  console.log('Conexion establecida con la DB')
  
  app.listen(port, () => {
    console.log(`Corre en el puerto ${port}`)
  })
})
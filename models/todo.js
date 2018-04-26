'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = Schema({
  description: String,
  state: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Todo', TodoSchema)
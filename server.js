// declare and define variables
var express = require('express')
var todos = require('./to-do-list.js')
var app = express() // create an express app
var bodyParser = require('body-parser')

app.use(bodyParser.json())
var port = process.env.PORT || 8080 // 8080 if not defined

// home --  welcome note!
app.get('/', function (req, res) {
  res.json({
    welcome: 'Welcome to this amazing To Do List API!'
  })
})

// see all todo items at '/todos'
app.get('/todos', function (req, res) {
  res.json(todos)
})

// If a todo at /todos/:id does not exist, a 404 status code is returned
app.get('/todos/:slug', function (req, res) {
  if (!todos[req.params.slug]) {
    res.status(404).end('Oops!, no such to do list found: ' + req.params.slug)
    return
  }
  res.json(todos[req.params.slug])
})

// POSTing to /todos
app.post('/todos', function (req, res) {
  var slug = req.body.ToDoTitle.trim().toLowerCase().split(' ').join('-')
  todos[slug] = {
    ToDoTitle: req.body.ToDoTitle.trim(),
    Done: req.body.Done.toUpperCase()
  }
  res.redirect('/todos/' + slug) // redirect to
})

// Delete 'todos/'
app.delete('/todos/:slug', function (req, res) {
  delete todos[req.params.slug]
  res.redirect('/todos')
})

// put -- Update-- 'todos'
app.put('/todos/:slug', function (req, res) {
  var todo = todos[req.params.slug]
  if (req.body.ToDoTitle !== undefined) {
    todo.ToDoTitle = req.body.ToDoTitle.trim()
  }
  if (req.body.Done !== undefined) {
    todo.Done = req.body.Done.toUpperCase()
  }
  res.redirect('/todos') // redirect to
})

// URLs besides /todos and /todos/:id respond with a 404 status code
app.use(function (req, res, next) {
  res.status(404).end(req.url + ' is not a directory we know. Try something else!')
})

// listen to the specified port
app.listen(port)

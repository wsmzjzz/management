var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
// var shortid = require('shortid')
var users = require('./users.json')
var goods = require('./goods.json')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8088

var router = express.Router()

// Unsafely enable cors
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// logging middleware
router.use(function(req, res, next) {
    console.log('\nReceived:',{url: req.originalUrl, body: req.body, query: req.query})
    next()
})

// Simple in memory database
const database = {
  users
}


// Utility functions
const findRoom = (roomId) => {
  const room = database.find((room) => {
    return room.id === parseInt(roomId)
  })
  if (room === undefined){
    return {error: `a room with id ${roomId} does not exist`}
  }
  return room
}

const logUser = (room, username) => {
  const userNotLogged = !room.users.find((user) => {
    return user === username
  })

  if (userNotLogged) {
    room.users.push(username)
  }
}

// API Routes
router.post('/login', function(req, res) {
  // const users = database.users
  const user = req.body
  res.json({ user: user, login: true })
})

const rooms = []

router.get('/rooms', function(req, res) {
    const rooms = database.map((room) => {
      return {name: room.name, id: room.id}
    })
    console.log('Response:',rooms)
    res.json(rooms)
})

router.get('/users', function(req, res) {
  res.json(users)
})

router.get('/goods', function(req, res) {
  res.json(goods)
})

router.get('/rooms/:roomId', function(req, res) {
  room = findRoom(req.params.roomId)
  if (room.error) {
    console.log('Response:',room)
    res.json(room)
  } else {
    console.log('Response:',{name: room.name, id: room.id, users: room.users})
    res.json({name: room.name, id: room.id, users: room.users})
  }
})

// router.route('/rooms/:roomId/messages')
//   .get(function(req, res) {
//     room = findRoom(req.params.roomId)
//     if (room.error) {
//       console.log('Response:',room)
//       res.json(room)
//     } else {
//       console.log('Response:',room.messages)
//       res.json(room.messages)
//     }
//   })
//   .post(function(req, res) {
//     room = findRoom(req.params.roomId)
//     if (room.error) {
//       console.log('Response:',room)
//       res.json(room)
//     } else if (!req.body.name || !req.body.message) {
//       console.log('Response:',{error: 'request missing name or message'})
//       res.json({error: 'request missing name or message'})
//     } else {
//       logUser(room, req.body.name)
//       const reaction = req.body.reaction || null
//       const messageObj = { name: req.body.name, message: req.body.message, id: shortid.generate(), reaction }
//       room.messages.push(messageObj)
//       console.log('Response:',{message: 'OK!'})
//       res.json(messageObj)
//     }
//   })

app.use('/api', router)
app.listen(port)
console.log(`API running at localhost:${port}/api`)

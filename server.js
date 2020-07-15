const express = require('express'); // importing a CommonJS module
const hubsRouter = require('./hubs/hubs-router.js');
const messagesRouter = require('./hubs/messages-router');
const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

server.use(express.json());
server.use(helmet());
// server.use(morgan())
server.use(methodLogger)
server.use(addName)
// server.use(lockout)
// server.use(divisbleByThree)

server.use('/api/hubs', hubsRouter);
// server.use('/api/hubs/', messagesRouter)

server.get("/", morgan('dev'));
server.delete('/', morgan('tiny'));

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// server.delete("/", (req, res ) => {
//   res.send('deleted')
// })

function methodLogger(req, res, next){
  console.log(`${req.method} request`)
  next();
}


function addName(req, res, next) {
  req.name = req.name || req.headers['x-name'];
  next();
}

function divisbleByThree (req, res, next) {
  let d = new Date()
  let n = d.getSeconds()
  if(n % 3 === 0){
    res.status(403).json({errormessage: 'You shall not pass!'})
  }
 next();
}

function lockout(req, res, next) {
  res.status(403).json({message: 'api in maintnatce mode'})
}

server.use((error, req, res, next) => {
  res.status(400).json({ message: 'There was an error', error})
})

module.exports = server;

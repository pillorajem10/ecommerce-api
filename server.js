//dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const morgan = require('morgan');

//config
const config = require('./config');

//functions
const app = express();

//port
const port = 3001;

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(expressValidator());
app.use(morgan('dev'));

//import routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const category = require('./routes/category');

//routes
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/category', category);

//mongoose connection
const connection = mongoose.connection;

//mongoose || mongodb
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

connection.once('open', function() {
    console.log("connected to database");
})


app.get('/', (req, res) => {
  res.send('eコマースの実践')
})

//listener
app.listen(port, function() {
    console.log(`Server is running on port: ${port}`);
});

const express = require('express')
const app = express()
const mongoose = require('mongoose')


const users = require('./routes/users')
const auth = require('./routes/auth');
const config = require('config');

if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/Car-Rental').
then(() => {console.log('connected the data base')
}).catch(err => {console.log(err)})

app.use(express.json());


app.use('/api/users' , users);
app.use('/api/auth' , auth);

const port = 3000;
app.listen(port, ()=> {
    console.log(`listening on ${port}port number` );
})


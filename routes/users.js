const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const {User , validate } = require('../model/user')

// create user
router.post('/' ,async(req, res)=> {
    // validate the the request
    const {error} = validate(req.body)
    if(error) return res.status(404).send(error.details[0].message)

     // Check by email  if this user already exisits
    let user = await User.findOne({email: req.body.email})

    if (user) return res.status(400).send(`user email ${req.body.email} already exist`)

    user = new User(
        _.pick(req.body ,['name', 'email', 'password'])

        )
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
     await user.save()
    
    const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));


})

module.exports = router;
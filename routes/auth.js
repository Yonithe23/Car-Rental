const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const jwt = require('jsonwebtoken');
const {User } = require('../model/user')

// create user
router.post('/' ,async(req, res)=> {
    // validate the the request
    const {error} = validate(req.body)
    if(error) return res.status(404).send(error.details[0].message)

      //  Now find the user by their email address
    let user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Incorrect email or password.')

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }

    const token = jwt.sign({ _id: user._id }, 'PrivateKey');
    res.send(token);


})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
    //return Joi.validate(user, schema);
}


module.exports = router;
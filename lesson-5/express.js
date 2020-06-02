const express = require('express');
const path = require('path');
const consolidate = require('consolidate'); // для работы с шаблонизаторами
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:45612/learning', { // /dbName
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const User = require('./models/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/users', async (req, res) => {
    const users = await User.find();
    //console.log(req.params);
    res.json(users);
});
app.get('/users/:id', async(req, res) => {
    const users = await User.findById(req.params.id);
    //console.log(req.params);
    res.json(users);
});
app.post('/users', async(req, res) => {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
});

app.put('/users', async(req, res) => {
    if(!req.body) return res.sendStatus(400);
    // User.findOneAndUpdate(req.query, req.body, {new: true}, (err, user) => {
    //     if(err) return console.log(err);
    //     res.send(`${user.id} is updated`)
    // })
    User.updateMany(req.query, req.body, {new: true}, (err, user) => {
        if(err) return console.log(err);
        console.log(user);
        res.send(`${user.n} users is updated`);
    })
});

app.delete('/users', async(req, res) => {
    // User.findOneAndDelete(req.query, {}, (err, user) => {
    //     if(err) return console.log(err);
    //     res.send(`${user.id} is deleted`);
    // })
    User.deleteMany(req.query, {}, (err, user) => {
            if(err) return console.log(err);
            res.send(`OK! deletedCount: ${user.n}`);
        })
});

// эксперименты
// app.get('/par', async (req, res) => {
//     if(req.query.id) {
//         req.query['_id'] = req.query.id;
//         delete req.query.id;
//     }
//     console.log(req.query);
//     res.send(`OK`);
// });

app.listen(5000, () => {
    console.log('Server has been started!');
});

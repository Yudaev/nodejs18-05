const express = require('express');
const path = require('path');
const consolidate = require('consolidate'); // для работы с шаблонизаторами
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./auth');
//
mongoose.connect('mongodb://localhost:32768/learning', { // /dbName
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const User = require('./models/user');
const Task = require('./models/task');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    resave: true, // сохранять сессии
    saveUninitialized: false, // сохранение в базе сессий для неавторизованных пользователей
    secret: 'super puper secret',
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize);
app.use(passport.session);

app.use('/tasks', passport.mustBeAuthenticated); // Все что начинается с tasks юзер должен быть авторизован (самописная мидлвара)

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/tasks', async (req, res) => {
    const { _id } = req.user;
    const tasks = await Task.find({ user: _id }).lean();
    ///console.log(tasks);
    res.render('tasks', {tasks});
});

app.post('/tasks/complete', async (req, res) => {
    const { id, completed } = req.body;
    await Task.updateOne({_id: id}, { $set: { completed: !JSON.parse(completed)}});
    res.redirect('/tasks');
});

app.post('/tasks/remove', async (req, res) => {
    const { id } = req.body;
    await Task.findByIdAndRemove(id);
    res.redirect('/tasks');
});

app.post('/tasks', async (req, res) => {
    const { _id } = req.user;
    const task = new Task({...req.body, user: _id});
    await task.save();
    res.redirect('/tasks');
});

app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('task', task);
});

app.post('/tasks/update', async (req, res) => {
    const { id, title } = req.body;
    await Task.updateOne({_id: id}, { $set: { title } });
    res.redirect('/tasks');
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});
app.get('/users/:id', async(req, res) => {
    const users = await User.findById(req.params.id);
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

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body;

    if(restBody.password === repassword) {
        const user = new User(restBody);
        await user.save();

        res.redirect('/auth');
    } else {
        res.redirect('/register?err=repass')
    }
});

app.get('/auth', (req, res) => {
    const { error } = req.query;
    res.render('auth', { error });
});

app.post('/auth', passport.authenticate);

app.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/auth');
});

app.listen(5000, () => {
    console.log('Server has been started!');
});

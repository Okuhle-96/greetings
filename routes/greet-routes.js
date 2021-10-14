module.exports = function (pool) {

    const greetFactory = require('../greetFactory');
    const greeted = greetFactory(pool)


    async function home(req, res) {
        var home = await greeted.select()
        var message = greeted.returnMessage()

        res.render('index', {
            greet: message,
            count: home
        });

    }

    async function greetUser(req, res) {
        greeted.clear()
        greeted.errors(req.body.enterName, req.body.languages, req)
        if (req.body.languages) {
            await greeted.addNames(req.body.enterName, req.body.languages),
                greeted.greetMe(req.body.enterName, req.body.languages)
        }
        res.redirect('/');

    }

    async function namesGreeted(req, res) {
        var names = await greeted.names()

        res.render('greeted', {
            nameCount: names
        });
    }

    async function countName(req, res) {
        var users = req.params.username
        var newCount = await greeted.addCounter(users)

        res.render('counter', {
            name: users,
            counter: newCount
        });

    }

    async function clearCount(req, res) {
        greeted.clear()
        await greeted.reset()

        res.redirect('/')

    }

    return {
        home,
        greetUser,
        namesGreeted,
        countName,
        clearCount
    }


}
module.exports = function (pool) {
  const greetFactory = require("../greetings");
  const greeted = greetFactory(pool);

  async function home(req, res) {
    var home = await greeted.select();
    var message = greeted.returnMessage();

    res.render("index", {
      greet: message,
      count: home,
    });
  }

  async function greetUser(req, res) {
    greeted.errors(req.body.enterName, req.body.languages, req);
    if (req.body.languages) {
      await greeted.countNames(req.body.enterName, req.body.languages),
        greeted.greetUser(req.body.enterName, req.body.languages);
    }
    res.redirect("/");
  }

  async function namesGreeted(req, res, next) {
    try {
      var names = await greeted.names();

      res.render("greeted", {
        nameCount: names,
      });
    } catch (err) {
      next(err);
    }
  }

  async function countName(req, res) {
    var users = req.params.username;
    var counts = await greeted.nameCounter(users);

    res.render("counter", {
      name: users,
      counter: counts,
    });
  }

  async function clearCount(req, res) {
    greeted.clearMsg();
    await greeted.reset();

    res.redirect("/");
  }

  return {
    home,
    greetUser,
    namesGreeted,
    countName,
    clearCount,
  };
};

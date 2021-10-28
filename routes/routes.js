module.exports = function (pool) {
  const greetFactory = require("../greetings");
  const greeted = greetFactory(pool);

  async function home(req, res, next) {
    try {
      var home = await greeted.selectNames();
      var message = greeted.returnMessage();

      res.render("index", {
        greet: message,
        count: home,
      });
    } catch (err) {
      next(err);
    }
  }

  async function greetUser(req, res, next) {
    try {
      greeted.errors(req.body.enterName, req.body.languages, req);
      if (req.body.languages) {
        await greeted.countNames(req.body.enterName, req.body.languages),
          greeted.greetUsers(req.body.enterName, req.body.languages);
      }
      res.redirect("/");
    } catch (err) {
      next(err);
    }
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

  async function countName(req, res, next) {
    try {
      var users = req.params.username;
      var counts = await greeted.nameCounter(users);

      res.render("counter", {
        name: users,
        counter: counts,
      });
    } catch (err) {
      next(err);
    }
  }

  async function clearCount(req, res, next) {
    try {
      greeted.clearMsg();
      await greeted.reset();

      res.redirect("/");
    } catch {
      next(err);
    }
  }

  return {
    home,
    greetUser,
    namesGreeted,
    countName,
    clearCount,
  };
};

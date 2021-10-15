module.exports = function (pool) {
  var regex = /^[a-zA-Z]+$/;
  var greetMessage;

  async function select() {
    var users = await pool.query("select * from users");
    const selectedUsers = users.rowCount;

    return selectedUsers;
  }

  function returnMessage() {
    return greetMessage;
  }

  function greetUser(name, language) {
    var nameToUpp = name[0].toUpperCase() + name.slice(1).toLowerCase();

    if (language === "isixhosa" && regex.test(nameToUpp)) {
      greetMessage = "Mholo, " + nameToUpp;
    } else if (language === "xitsonga" && regex.test(nameToUpp)) {
      greetMessage = "Ahee, " + nameToUpp;
    } else if (language === "sesotho" && regex.test(nameToUpp)) {
      greetMessage = "Dumelang, " + nameToUpp;
    }
  }

  async function countNames(name, language) {
    var nameToUpp = name[0].toUpperCase() + name.slice(1).toLowerCase();
    if (regex.test(nameToUpp) && language) {
      var checkname = await pool.query(
        `SELECT username from users WHERE username = $1`,
        [nameToUpp]
      );

      if (checkname.rowCount < 1) {
        await pool.query(
          `INSERT INTO users (username,counters) VALUES ($1,$2)`,
          [nameToUpp, 1]
      );
      
      } else {
        await pool.query(
          `UPDATE users SET counters = counters + 1 WHERE username = $1`,
          [nameToUpp]
        );
      }
    }
  }

  async function errors(name, language, req) {
    var nameToUpp = name[0].toUpperCase() + name.slice(1).toLowerCase();

    var checkname = await pool.query(
      `SELECT username from users WHERE username = $1`,
      [nameToUpp]
    );

    if (!checkname.rowCount < 1) {
      req.flash("info", "You have already been greeted!");
    }
    if (!name && !language) {
      req.flash("info", "Please enter your name and select your language!");
    } else if (name && !language) {
      req.flash("info", "Please select youur language!");
    } else if (!name || !regex.test(name)) {
      req.flash("info", "Please enter a valid name, eg Mark");
    }
  }

  function clearMsg() {
    greetMessage = "";
  }

  async function names() {
    const result = await pool.query("select username from users");
    var namesGreeted = result.rows;

    return namesGreeted;
  }

  async function nameCounter(names) {
    var nameCount = await pool.query(
      "select counters from users WHERE username = $1",
      [names]
    );
    var count = nameCount.rows[0];
    var counts = count.counters;

    return counts;
  }

  async function reset() {
    var deleted = await pool.query("delete from users");
    return deleted;
  }

  return {
    select,
    returnMessage,
    greetUser,
    countNames,
    errors,
    clearMsg,
    names,
    nameCounter,
    reset,
  };
};

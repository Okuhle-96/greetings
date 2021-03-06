module.exports = function (pool) {
  var regex = /^[a-zA-Z]+$/;
  var greetMessage;

  async function userCount() {
    var users = await pool.query("select * from users");
    const count = users.rowCount;

    return count;
  }

  function returnMessage() {
    return greetMessage;
  }

  function greetUsers(name, language) {
    // var nameToUpp = name[0].toUpperCase() + name.slice(1).toLowerCase();

    if (language === "isixhosa" && regex.test(name)) {
      greetMessage = "Mholo, " + name;
    } else if (language === "xitsonga" && regex.test(name)) {
      greetMessage = "Ahee, " + name;
    } else if (language === "sesotho" && regex.test(name)) {
      greetMessage = "Dumelang, " + name;
    }
  }

  async function countNames(name) {
    if (!name[0]) {
      return;
    }

    var nameToUpp = name[0].toUpperCase() + name.slice(1).toLowerCase();
    if (regex.test(nameToUpp)) {
      var checknames = await pool.query(
        `SELECT username from users WHERE username = $1`,
        [nameToUpp]
      );

      if (checknames.rowCount < 1) {
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

  async function errors(nameInput, language, req) {

    if (nameInput === "" && language === undefined) {
      req.flash("info", "Please enter your name and select your language!");
    
      return true;
      
    } else if (language === undefined) {
      req.flash("info", "Please select your language!");
      return true;
    } else if ((nameInput === "" && language )|| ( nameInput === undefined && language)){
      req.flash("info", "Please enter your name");
      return true;
    } else if (!regex.test(nameInput)) {
      req.flash("info", "Please enter a valid name, eg Mark");
      return true;
    } else {
      var checkname = await pool.query(
        `SELECT username from users WHERE username = $1`,
        [nameInput]
      );

      if (!checkname.rowCount < 1) {
        req.flash("info", "You have already been greeted!");
        return true;
      }
    }
    return req.flash("info");
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
    userCount,
    returnMessage,
    greetUsers,
    countNames,
    errors,
    clearMsg,
    names,
    nameCounter,
    reset,
  }
}

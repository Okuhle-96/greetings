module.exports = function (pool) {


    var greetMessage;

    var regex = /^[a-zA-Z]+$/;

    async function select() {

        var counted = await pool.query('select * from users')
        const countRes = counted.rowCount;

        return countRes

    }

    function returnMessage() {
        return greetMessage;
    }

    async function addNames(name, language) {
        var upperName = name[0].toUpperCase() + name.slice(1).toLowerCase()
        if (regex.test(upperName) && language) {
            var checkname = await pool.query(`SELECT username from users WHERE username = $1`, [upperName]);

            if (checkname.rowCount < 1) {

                await pool.query(`INSERT INTO users (username,counters) VALUES ($1,$2)`, [upperName, 1])
            }

            else {
                await pool.query(`UPDATE users SET counters = counters + 1 WHERE username = $1`, [upperName])

            }
        }
    }
    function greetMe(name, language) {
        var upperName = name[0].toUpperCase() + name.slice(1).toLowerCase()
        
            if (language === "English" && regex.test(upperName)) {

                greetMessage = "Mholo, " + upperName
            }
            else if (language === "Swedish" && regex.test(upperName)) {

                greetMessage = "Ahee, " + upperName
            }
            else if (language === "Dutch" && regex.test(upperName)) {

                greetMessage = "Dumelang, " + upperName

            }

    }
    function clear() {
        greetMessage = ""
    }

    async function errors(name, language, req) {
        var upperName = name[0].toUpperCase() + name.slice(1).toLowerCase()

        var checkname = await pool.query(`SELECT username from users WHERE username = $1`, [upperName]);

        if (!checkname.rowCount < 1) {
            req.flash('info', 'You have already been greeted!');
        }
        if (!name && !language) {
            req.flash('info', 'Please enter your name and select your language!');
        }
        else if (name && !language) {
            req.flash('info', 'Please select your language!');
        }
        else if (!name || !regex.test(name)) {
            req.flash('info', 'Please enter a valid name, eg Mark');
        }
    }

    async function names() {
        const result = await pool.query('select username from users')
        var namesGreeted = result.rows;

        return namesGreeted;

    }

    async function addCounter(users) {
        var usersTotal = await pool.query('select counters from users WHERE username = $1', [users])
        var counted = usersTotal.rows[0];
        var newCount = counted.counters;

        return newCount

    }

    async function reset() {
        var deleted = await pool.query('delete from users')

        return deleted
    }

    return {
        select,
        returnMessage,
        addNames,
        clear,
        errors,
        greetMe,
        names,
        addCounter,
        reset
    }


}
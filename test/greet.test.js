const assert = require('assert');
const pg = require("pg");
const greetFactory = require('../greetFactory');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coderr:1996@localhost:5432/users_test';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function () {

    beforeEach(async function () {
        await pool.query("delete from users;");
    });

    it('should return the accurate count of names greeted', async function () {

        let greet = greetFactory(pool);

        await greet.countNames(
            'Kodwa', 'isixhosa'
        );
        await greet.countNames(
            'Matt', 'isixhosa'
        );
        await greet.countNames(
            'Salvatore', 'isixhosa'
        );



        let count = await greet.select();
        assert.deepEqual(3, count);
    });
    it('Should count a name one even its greeted in a different language', async function () {

        let greet = greetFactory(pool);
        await greet.countNames(
            'Kodwa', 'isixhosa'
        );
        await greet.countNames(
            'Kodwa', 'sesotho'
        );
        await greet.countNames(
            'Kodwa', 'sesotho'
        );


        let count = await greet.select();
        assert.deepEqual(1, count);
    });
    it('Should only take alphabets when greeting a user', async function () {

        let greet = greetFactory(pool);

        await greet.countNames(
            'Kamva', 'isixhosa'
        );
        await greet.countNames(
            '123', 'isixhosa'
        );
        await greet.countNames(
            '!@#$%', 'isixhosa'
        );

        let count = await greet.select();
        assert.equal(1, count);
    });
    
    after(function () {
        pool.end();
    })
});
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

    it('should pass the database test', async function () {

        let greet = greetFactory(pool);
        await greet.addNames(
            'Kodwa', 'English'
        );
        await greet.addNames(
            'Matt', 'English'
        );
        await greet.addNames(
            'Salvatore', 'English'
        );

        let count = await greet.namesList();
        assert.deepEqual([{ username: 'Kodwa' }, { username: 'Matt' }, { username: 'Salvatore' }], count);
    });

    it('should return the accurate count of names greeted', async function () {

        let greet = greetFactory(pool);
        await greet.addNames(
            'Kodwa', 'English'
        );
        await greet.addNames(
            'Matt', 'English'
        );
        await greet.addNames(
            'Salvatore', 'English'
        );



        let count = await greet.select();
        assert.deepEqual(3, count);
    });
    it('should not count duplicate names', async function () {

        let greet = greetFactory(pool);
        await greet.addNames(
            'Kodwa', 'English'
        );
        await greet.addNames(
            'Kodwa', 'English'
        );
        await greet.addNames(
            'Kodwa', 'English'
        );


        let count = await greet.select();
        assert.deepEqual(1, count);
    });
    it('should not include non-alphabetic characters', async function () {

        let greet = greetFactory(pool);
        await greet.addNames(
            'Kamva', 'English'
        );
        await greet.addNames(
            '123', 'English'
        );
        await greet.addNames(
            '!@#$%', 'English'
        );

        let count = await greet.select();
        assert.equal(1, count);
    });
    
    after(function () {
        pool.end();
    })
});
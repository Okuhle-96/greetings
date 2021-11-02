const assert = require("assert");
const pg = require("pg");
const greetFactory = require("../greetings");
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://coderr:1996@localhost:5432/users_test";

const pool = new Pool({
  connectionString,
});

describe("The basic database web app", function () {
  beforeEach(async function () {
    await pool.query("delete from users;");
  });

  it("Should be able to greet a user in IsiXhosa", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.greetUsers("Kodwa", "isixhosa");

    let greet = await testGreet.returnMessage();
    assert.deepEqual("Mholo, Kodwa", greet);
  });

  it("Should be able to greet a user in XiTsonga", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.greetUsers("Koko", "xitsonga");

    let greet = await testGreet.returnMessage();
    assert.deepEqual("Ahee, Koko", greet);
  });

  it("Should be able to greet a user in SeSotho", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.greetUsers("Kamva", "sesotho");

    let greet = await testGreet.returnMessage();
    assert.deepEqual("Dumelang, Kamva", greet);
  });

  it("Should count the number of people greeted", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.countNames("Kodwa", "isixhosa");
    await testGreet.countNames("Matt", "isixhosa");
    await testGreet.countNames("Salvatore", "isixhosa");

    let counter = await testGreet.selectNames();
    assert.deepEqual(3, counter);
  });

  it("Should count a name once even its greeted in a different language", async function () {
    let testGreet = greetFactory(pool);
    await testGreet.countNames("Kodwa", "isixhosa");
    await testGreet.countNames("kodwa", "sesotho");
    await testGreet.countNames("Kodwa", "sesotho");

    let counter = await testGreet.selectNames();
    assert.deepEqual(1, counter);
  });

  it("Should be able to display the names greeted", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.countNames("Kodwa", "isixhosa");
    await testGreet.countNames("Matt", "isixhosa");
    await testGreet.countNames("Salvatore", "isixhosa");

    let namesGreeted = await testGreet.names();
    assert.deepEqual(
      [{ username: "Kodwa" }, { username: "Matt" }, { username: "Salvatore" }],
      namesGreeted
    );
  });

  it("Should only take and count alphabets when greeting a user", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.countNames("Kamva", "isixhosa");
    await testGreet.countNames("45679", "isixhosa");
    await testGreet.countNames("!@@#$%%^", "isixhosa");

    let counter = await testGreet.selectNames();
    assert.equal(1, counter);
  });

  it("Should be able to clear messages after greeting", async function () {
    let testGreet = greetFactory(pool);

    await testGreet.greetUsers("Okuhle", "isixhosa");
    await testGreet.greetUsers("Okuhle", "sesotho");
   
    let clearMsgs = await testGreet.clearMsg();
    assert.equal(undefined, clearMsgs);
  });

  after(function () {
    pool.end();
  });
});

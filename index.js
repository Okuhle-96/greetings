const express = require("express");
const flash = require("express-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");

const pg = require("pg");
const Pool = pg.Pool;
const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});

const bodyParser = require("body-parser");
const greetRoutes = require("./routes/routes");
const app = express();

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "Please Enter Your Name",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL ||
"postgresql://coderr:1996@localhost:5432/my_database",

const pool = new Pool({
   connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const greet = greetRoutes(pool);

app.get("/", greet.home);
app.post("/greet", greet.greetUser);
app.get("/greeted", greet.namesGreeted);
app.get("/counter/:username", greet.countName);
app.post("/reset", greet.clearCount);

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
  console.log("App started at PORT : ", PORT);
});

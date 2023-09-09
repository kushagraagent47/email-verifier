var express = require("express");
const port = 8080;

//email existance
const emailExists = require("email-exists");
//Body parser
var app = express();
var cors = require("cors");

var bodyParser = require("body-parser");
var multer = require("multer");
var forms = multer();
app.use(cors());

var emailExistence = require("email-existence");
const { validate } = require("deep-email-validator");
app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

const dns = require("dns");
const { default: axios } = require("axios");

//View engine
app.set("view engine", "ejs");

function domainExists(domain) {
  return new Promise((resolve) => {
    dns.resolve(domain, (err, addresses) => {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

app.get("/v1/validate/emails", async function (req, res) {
  try {
    var email = req.query.email;
    if (typeof email == "undefined") {
      res.send({ message: false });
    } else {
      try {
        var check_website = email.split("@")[1];
        var check_website = "www." + check_website;
        var check_website_existance = await domainExists(check_website);
        if (check_website_existance == true) {
          emailExistence.check(email, function (error, response) {
            if (error) {
              console.log(error);
              res.send("Wrong Email");
            } else if (response == true) {
              res.send("Correct Email");
            } else {
              res.send("Wrong Email");
            }
          });
        } else {
          res.send("Wrong Email");
        }
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "An error occurred while validating the email." });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ message: false });
  }
});

app.listen(port, () => console.log(`App listening on PROD ${port}!`));

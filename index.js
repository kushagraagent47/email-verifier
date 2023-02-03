var express = require("express");
const port = 8080;

//email existance
const emailExists = require("email-exists");
//Body parser
var app = express();
var cors = require('cors')

var bodyParser = require("body-parser");
var multer = require("multer");
var forms = multer();
app.use(cors())

var emailExistence = require("email-existence");

app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

//View engine
app.set("view engine", "ejs");

function verifyEmail(email) {
  return new Promise((resolve, reject) => {
    verifier.verify(email, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

//Homepage
app.get("/", async function (req, res) {
  res.render("index");
});

//Find emails
function findemail(first_name, last_name, domain) {
  var emails = [];

  //First name
  emails.push(first_name);
  emails.push(first_name + last_name);
  emails.push(first_name + "." + last_name);
  emails.push(first_name + "_" + last_name);
  emails.push(first_name + last_name[0]);
  emails.push(first_name + "." + last_name[0]);
  emails.push(first_name + "_" + last_name[0]);
  emails.push(first_name[0] + last_name);
  emails.push(first_name[0] + "." + last_name);
  emails.push(first_name[0] + "_" + last_name);
  emails.push(first_name[0] + last_name[0]);
  emails.push(first_name[0] + "." + last_name[0]);
  emails.push(first_name[0] + "_" + last_name[0]);
  emails.push(last_name);
  emails.push(last_name + first_name);
  emails.push(last_name + "." + first_name);
  emails.push(last_name + "_" + first_name);
  emails.push(last_name + first_name[0]);
  emails.push(last_name + "." + first_name[0]);
  emails.push(last_name + "_" + first_name[0]);
  emails.push(last_name[0] + first_name);
  emails.push(last_name[0] + "." + first_name);
  emails.push(last_name[0] + "_" + first_name);
  emails.push(last_name[0] + first_name[0]);
  emails.push(last_name[0] + "." + first_name[0]);
  emails.push(last_name[0] + "_" + first_name[0]);
  for (var i = 0; i < emails.length; i++) {
    emails[i] = emails[i] + "@" + domain;
  }
  return emails;
}

app.get("/find/email/list", async function (req, res) {
  var first_name = "ashneer";
  var last_name = "grover";
  var domain = "third-unicorn.com";
  var emails = findemail(first_name, last_name, domain);
  var valid_emails = [];
		
  res.send(emails);
});

app.post("/validate/email", async function (req, res) {
  try {
    var email = req.body?.email;
    if (typeof email != "undefined") {
      emailExists({ sender: "developer@emailhunt.in", recipient: email, debug: true })
        .then(function (result) {
          if (result == "MAY_EXIST") {
            res.render("index", { email: email, value: "Healthy" });
          } else {
            res.render("index", { email: email, value: "Unhealthy" });
          }
        })
        .catch(function (err) {
          res.send(err)
        });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// //V2
app.post("/v1/validate/email", async function (req, res) {
  try {
    var email = req.body?.email;
    if (typeof email != "undefined") {
      emailExistence.check(email, function (error, response) {
        if (error) {
          console.log(error);
          res.send(error)
        } else if(response == true) {
		res.send({message: true})
	} else {
		res.send({message:false})
	}
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(port, () => console.log(`App listening on PROD ${port}!`));

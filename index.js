var express = require("express");
const port = 8080;

var verifier = require("email-verify");
var infoCodes = verifier.infoCodes;

//Body parser
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');
var forms = multer();
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

app.get("/test/email", async function (req, res) {
  var first_name = "kushagra";
  var last_name = "kumar";
  var domain = "level.game";

  var array = [];
  //Get all combinations
  var all_emails = findemail(first_name, last_name, domain);

  for (var i = 0; i < all_emails.length; i++) {
    var info = await verifyEmail(all_emails[i]);
    if (info.success == true) {
      array.push(all_emails[i]);
    }
  }
  res.send(array);
});

app.post("/validate/email", async function (req, res) {
  try {
    var email = req.body?.email;
    if (typeof email != "undefined") {
      var info = await verifyEmail(email);
      if (info.success == true) {
        res.render("index", { email: email, value: "Healthy" });
      } else {
        res.render("index", { email: email, value: "Unhealthy" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});


app.listen(port, () => console.log(`App listening on PROD ${port}!`));

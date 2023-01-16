var express = require("express");
var app = express();
const port = 8080;

var verifier = require("email-verify");
var infoCodes = verifier.infoCodes;

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
  return emails
}

app.get("/test/email", async function (req, res) {
  var first_name = "kushagra";
  var last_name = "kumar";
  var domain = "level.game"

  var array = []
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

app.listen(port, () => console.log(`App listening on PROD ${port}!`));

var express = require("express");
const port = 8080;

var verifier = require("email-verify");
var infoCodes = verifier.infoCodes;

//email existance
var emailExistence = require("email-existence");
//Body parser
var app = express();

var bodyParser = require("body-parser");
var multer = require("multer");
var forms = multer();

// // // Mailer zoho
// // const nodemailer = require("nodemailer");
// // //Zoho config
// // let transporter = nodemailer.createTransport({
// //   host: "smtp.zoho.in",
// //   port: 465,
// //   secure: true, // true for 465, false for other ports
// //   auth: {
// //     user: "developer@emailhunt.in", // your email address
// //     pass: "We5fZ802RYYP", // your email account password
// //   },
// // });

// // transporter.verify((error, success) => {
// //   if (error) {
// //       console.log(error);
// //   } else {
// //       console.log('Server is ready to take messages');
// //   }
// });


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
  verifier.verify( 'kushagra@level.game', function( err, info ){
    if( err ) console.log(err);
    else{
      console.log( "Success (T/F): " + info.success );
      console.log( "Info: " + info.info );
  
      //Info object returns a code which representing a state of validation:
  
      //Connected to SMTP server and finished email verification
      console.log(info.code === infoCodes.finishedVerification);
  
      //Domain not found
      console.log(info.code === infoCodes.domainNotFound);
  
      //Email is not valid
      console.log(info.code === infoCodes.invalidEmailStructure);
  
      //No MX record in domain name
      console.log(info.code === infoCodes.noMxRecords);
  
      //SMTP connection timeout
      console.log(info.code === infoCodes.SMTPConnectionTimeout);
  
      //SMTP connection error
      console.log(info.code === infoCodes.SMTPConnectionError)
    }
  });
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

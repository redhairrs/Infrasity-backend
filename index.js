const express = require("express")
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
var nodemailer = require("nodemailer");
const path  = require("path")



app.get("/", (req, res) => {
  res.send("Here's the server running");
});


app.get("/root", (req, res) => {
    const htmlpath = path.join(process.cwd(), "/")
    var files = fs.readdirSync(htmlpath);
    res.send(files);
});

app.get("/root2", (req, res) => {
    const htmlpath = path.join(process.cwd(), "/Backend")
    var files = fs.readdirSync(htmlpath);
    res.send(files);
});


app.post("/api/bookmeeting", async (req, res) => {
  try {
    // console.log(process.env.FROM_EMAIL, process.env.SMTP_PASS, process.env.TO_EMAIL)
    const htmlpath = path.join(process.cwd(), "/htmls/contactpage.html")
    const htmlTemplate = fs.readFileSync(htmlpath, 'utf8');
    const { fname,lname,company,email,country,ccode, phone} = req.body;
    const renderedHtmlContent = htmlTemplate.replace('{fname}', fname)
      .replace('{lname}', lname)
      .replace('{company}',company)
      .replace('{email}', email)
      .replace('{country}', country)
      .replace('{ccode}', ccode)
      .replace('{phone}', phone)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "mail.online.ayush@gmail.com",
        pass: "lmbn ufzj kqap cpgw"
      }
    });
    console.log(transporter, "transport")

    var mailOptions = {
      from: "mail.online.ayush@gmail.com",
      to: "aksr2003@gmail.com",
      subject: "You have new booking",
      html: renderedHtmlContent

    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send("Error in sending mail", error.message)
      }
    })

    res.send("All done successfully")
  } catch (error) {
      res.send(error.message)
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const Imap = require('imap')
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer')
require('dotenv').config()

const AUTO_REPLY_ADDRESS = "harrisidzwan2@gmail.com"

function sendEmail(recipientEmails = [], subject, body) {
  console.log(`Auto replying to ${recipientEmails}`)
  // for you to implement

  //SMTP Transport - Single Connection
  let transporter = nodemailer.createTransport({
    host: "imap.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
  });

  //Message Configuration
  var message = {
    from: process.env.GMAIL_USER,
    to: "harrisidzwan2@gmail.com",
    subject: `Re: ${subject}`,
    text: body
  };

  //Verify SMTP connection configuration
  transporter.sendMail(message, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  })
}

function manageInbox() {
  const imap = new Imap({
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { servername: 'imap.gmail.com' }
  });

  function getEmail(start, number) {
    console.log(`Getting email from seq: ${start}:${start + number}`)
    const f = imap.seq.fetch(`${start}:${start + number}`, {
      bodies: '',
      struct: true
    });
    f.on('message', function (msg, seqno) {
      const prefix = '#' + seqno;
      msg.on('body', stream => {
        simpleParser(stream, async (err, parsed) => {
          const { from, to, subject, date, textAsHtml, text } = parsed;
          console.log("-------------------");
          console.log("Email No. %s", prefix)
          console.log({ from: from.value[0], to: to.value, subject, date, textAsHtml, text });
          console.log("-------------------");

          if (from.value[0].address == AUTO_REPLY_ADDRESS) {
            sendEmail([from.value[0].address], `Re: ${subject}`, `Noted with thanks.\nRight on it, boss!\n\nHave a great day,\n${process.env.YOUR_NAME}`)
          }
        });
      });
    });
  }

  imap.once('error', function (err) {
    console.log(`Error: ${err}`);
  });

  imap.once('end', function () {
    console.log('Connection ended');
  });


  imap.on('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
      if (err) console.log(err)
      else console.log('Recipient is ready for accepting')
    })
  })

  let numberOfEmails = 0
  imap.on('mail', number => {
    if (numberOfEmails == 0) {
      console.log(`Current number of emails in inbox: ${number}`)
      numberOfEmails = number
    } else {
      getEmail(numberOfEmails + 1, number - 1)
      numberOfEmails += number
      console.log(`Number of emails updated to ${numberOfEmails}`)
    }
  })

  imap.on('expunge', number => {
    if (number <= numberOfEmails) {
      console.log(`Email #${number} was deleted`)
      numberOfEmails -= 1
      console.log(`Number of emails updated to ${numberOfEmails}`)
    }
  })

  imap.connect();
}

manageInbox()
# next-email-automator

This is my first project during the Next Academy bootcamp. The program is linked to the user's Gmail account and 
is able to:
1) View emails received in the inbox
2) Send automated replies back to the sender when the program is active. 
The program needs to be terminated manually using Cmd + C.

Most of the code was provided, essentially we only needed to add the code in index.js; between line 18 and line 30 as well as 
edit some codes in other parts of the file.

Also, an .env file should also be created and should contain the following:
- YOUR_NAME= **User's Name** 
- GMAIL_USER= **Gmail Address**
- GMAIL_PASSWORD= **Gmail Password** (via this link: https://myaccount.google.com/apppasswords)

Prior to program initialization, several steps are needed:
1) asdf local nodejs 19.4.0
2) npm init
3) npm install imap mailparser

To run: node index.js

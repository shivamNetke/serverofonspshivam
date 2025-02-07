const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define file path for saving loan applications
const filePath = path.join(__dirname, 'orders.txt');

// Nodemailer setup (No changes to user and pass)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'netkeshiv3521@gmail.com',
        pass: 'ocdq iyun clhl xgyl'
    }
});

app.post('/submit-application', (req, res) => {
    const { loanoption, name, address, pincode, loanAmount, mobileno, loantenure } = req.body;

    if (!loanoption || !name || !address || !pincode || !loanAmount || !mobileno || !loantenure) {
        return res.status(400).send('Error: All form fields are required.');
    }

    const loanData = `
    -------------- Loan Application --------------
    Loan Option: ${loanoption}
    Name: ${name}
    Address: ${address}
    Pincode: ${pincode}
    Loan Amount: ${loanAmount}
    Mobile No: ${mobileno}
    Loan Tenure: ${loantenure} months
    ----------------------------------------------
    `;

    // ✅ Print loan data in terminal
    console.log(loanData);

    // ✅ Save loan data in orders.txt
    fs.appendFile(filePath, loanData, (err) => {
        if (err) {
            console.error('Error saving to file:', err);
            return res.status(500).send('Error saving loan application.');
        }
        console.log('Loan data successfully saved to orders.txt');
    });

    // ✅ Send email with loan details
    const mailOptions = {
        from: 'netkeshiv3521@gmail.com',
        to: 'netakeshivam@aca.edu.in',
        subject: 'New Loan Application Received',
        text: `New loan application received:\n\n${loanData}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error occurred while sending email.');
        }
        console.log('Email sent successfully: ' + info.response);

        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Application Submitted - O N S P</title>
                    <style>
                        body {
                            background-color: white;
                            color: black;
                            text-align: center;
                            margin-top: 50px;
                        }
                        button {
                            text-decoration: none;
                            border: 1px solid #007bff;
                            border-radius: 3px;
                            background-color: white;
                            color: #007bff;
                            padding: 6px 40px;
                        }
                        button:hover {
                            color: white;
                            background-color: #007bff;
                            transition: ease-in-out;
                        }
                    </style>
                </head>
                <body>
                    <p>Your loan application has been successfully submitted. We will review and contact you soon. Thank you!</p>
                    <button onclick="goToHome()">Go to Home</button>
                    <script>
                        function goToHome() {
                            window.location.href = './index.html';
                        }
                    </script>
                </body>
            </html>
        `);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

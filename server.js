const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); 

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Route to serve the home page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({



    service: 'gmail',
    auth: {
        user: 'netkeshiv3521@gmail.com',
        pass: 'ocdq iyun clhl xgyl'
    }
});

// Route to handle loan application form submission
app.post('/submit-application', (req, res) => {
    const { loanoption, name, address, pincode, loanAmount, mobileno, loantenure } = req.body;

    // Log the form data to the console
    console.log(`Loan Option: ${loanoption}, Name: ${name}, Address: ${address}, Pincode: ${pincode}, Loan Amount: ${loanAmount}, Mobile No: ${mobileno}, Loan Tenure: ${loantenure} months`);

    // Nodemailer: Send an email with the loan application details
    const mailOptions = {
        from: 'netkeshiv3521@gmail.com',
        to: 'netakeshivam@aca.edu.in', 
        subject: 'New Loan Application Received',
        text: `New loan application received:\n\nLoan Option: ${loanoption}\nName: ${name}\nAddress: ${address}\nPincode: ${pincode}\nLoan Amount: ${loanAmount}\nMobile No: ${mobileno}\nLoan Tenure: ${loantenure} months`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error); 
            return res.status(500).send('Error occurred while sending email');
        }
        console.log('Email sent: ' + info.response);

        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="./01-index.css">
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

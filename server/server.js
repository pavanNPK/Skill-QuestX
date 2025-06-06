import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import xss from "xss";
import bodyParser from 'body-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Sanitize user input
function sanitizeInput(obj) {
    const sanitized = {};
    for (const key in obj) {
        sanitized[key] = xss(obj[key]);
    }
    return sanitized;
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT, // 465
    secure: true, // important: false for port 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Contact form route
app.post("/contact", async (req, res) => {
    console.log(req.body);
    const { name, email, message, phone } = sanitizeInput(req.body);

    try {
        await transporter.sendMail({
            from: `"SkillQuestX Contact Form" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
            replyTo: `${name} <${email}>`,
            subject: "New Contact Form Submission",
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            },
            html: `
              <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #6730DE; padding: 20px; text-align: center;">  
                 <img src="https://skillquestx.com/assets/images/core/banner.jpg" 
                       alt="SkillQuestX" 
                       width="auto" 
                       height="50" />                
                   <h4 style="color: #fff !important; margin: 0;">Hello Team 👋</h4>
                </div>
                <div style="padding: 20px;">
                  <p style="font-size: 16px;">🎉 <strong>We've received a new message from the contact form!</strong></p>
                  <table style="width: 100%; font-size: 15px; margin-top: 10px;">
                    <tr>
                      <td style="font-weight: bold; padding: 5px 0; width: 30%;">Name:</td>
                      <td>${name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; padding: 5px 0;">Email:</td>
                      <td>${email}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; padding: 5px 0;">Phone:</td>
                      <td>${phone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; padding: 5px 0;">Message:</td>
                      <td style="white-space: pre-wrap;">${message}</td>
                    </tr>
                  </table>
                </div>
                <div style="background-color: #f9f9f9; text-align: center; padding: 15px; color: #777; font-size: 13px;">
                  <p>📩 This message was sent via the contact form on <a href="https://skillquestx.com" style="color: #6730DE; text-decoration: none;">skillquestx.com</a></p>
                  <p>© ${new Date().getFullYear()} SkillQuestX. All rights reserved.</p>
                </div>
              </div>
            `
        });

        console.log("📬 Contact form email sent");
        res.send("Thank you! Your message has been sent.");
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).send("Something went wrong. Please try again later.");
    }
});

// Default route
app.get('/', (req, res) => {
    res.send({ message: 'Server is running!' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at ${process.env.APP_HOST || 'http://localhost'}:${port}`);
});

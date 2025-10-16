import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==================== Middleware ====================
app.use(express.json());
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

// Sanitize input helper
function sanitizeInput(obj) {
    const sanitized = {};
    for (const key in obj) {
        sanitized[key] = xss(obj[key]);
    }
    return sanitized;
}

// ==================== Static Frontend ====================
// Serve static files (HTML, CSS, JS, assets) from project root
app.use(express.static(path.join(__dirname, '../')));

// ==================== Routes ====================

// Contact Form Endpoint
app.post("/contact", async (req, res) => {
    const { name, email, message, phone } = sanitizeInput(req.body);

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

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
                   <h1 style="color: #fff !important; margin: 0;">SkillQuestX</h1> 
                   <h4 style="color: #fff !important; margin: 0;">Hello Team 👋</h4>
                </div>
                <div style="padding: 20px;">
                  <p style="font-size: 16px;">🎉 <strong>We've received a new message from the contact form!</strong></p>
                  <table style="width: 100%; font-size: 15px; margin-top: 10px;">
                    <tr><td style="font-weight: bold;">Name:</td><td>${name}</td></tr>
                    <tr><td style="font-weight: bold;">Email:</td><td>${email}</td></tr>
                    <tr><td style="font-weight: bold;">Phone:</td><td>${phone || 'N/A'}</td></tr>
                    <tr><td style="font-weight: bold;">Message:</td><td style="white-space: pre-wrap;">${message}</td></tr>
                  </table>
                </div>
                <div style="background-color: #f9f9f9; text-align: center; padding: 15px; color: #777; font-size: 13px;">
                  <p>📩 Sent via <a href="https://skillquestx.com" style="color: #6730DE;">skillquestx.com</a></p>
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

// Welcome Page (backend route)
app.get('/welcome', (req, res) => {
    res.send(`
      <html>
      <head>
        <title>Welcome to SkillQuestX</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex; align-items: center; justify-content: center;
            height: 100vh; color: white;
          }
          .box { text-align: center; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Welcome to SkillQuestX</h1>
          <p>REDEFINE | UPSKILL | SUCCEED</p>
          <a href="https://skillquestx.com" style="color:white;text-decoration:none;font-weight:bold;">Go to Site →</a>
        </div>
      </body>
      </html>
    `);
});

// ==================== SPA Catch-All ====================
// For any other routes, serve index.html (so Angular/React routes work)
app.use((req, res, next) => {
    // Skip API routes and static files
    if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return res.status(404).send('Not found');
    }
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ==================== Start Server ====================
const port = process.env.APP_PORT || 3000;

// Always bind to 0.0.0.0 so Nginx can reach Node inside Hostinger
app.listen(port, "0.0.0.0", () => {
    console.log(`✅ SkillQuestX backend running on port ${port}`);
});


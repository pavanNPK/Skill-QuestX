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
app.use(express.static('../')); // Serve files from parent directory (project root)
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
                   <h1 style="color: #fff !important; margin: 0;">SkillQuestX</h1> 
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

// Default route with styled HTML response
app.get('/welcome', (req, res) => {
    const welcomeHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SkillQuestX</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .welcome-container {
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 3rem 2rem;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                animation: fadeInUp 0.8s ease-out;
                max-width: 500px;
                width: 90%;
            }

            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
                background-size: 200% 200%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientShift 3s ease-in-out infinite;
                margin-bottom: 1rem;
            }

            .welcome-text {
                color: white;
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }

            .subtitle {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1rem;
                margin-bottom: 2rem;
            }

            .quest-button {
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
            }

            .quest-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                filter: brightness(1.1);
            }

            .particles {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: -1;
            }

            .particle {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                animation: float 6s ease-in-out infinite;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes gradientShift {
                0%, 100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-20px);
                }
            }

            .skill-icons {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-top: 1.5rem;
                opacity: 0.7;
            }

            .skill-icon {
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.8rem;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }
        </style>
    </head>
    <body>
        <div class="particles">
            <div class="particle" style="width: 4px; height: 4px; top: 20%; left: 20%; animation-delay: 0s;"></div>
            <div class="particle" style="width: 6px; height: 6px; top: 60%; left: 80%; animation-delay: 2s;"></div>
            <div class="particle" style="width: 3px; height: 3px; top: 80%; left: 30%; animation-delay: 4s;"></div>
            <div class="particle" style="width: 5px; height: 5px; top: 30%; left: 70%; animation-delay: 1s;"></div>
        </div>
        
        <div class="welcome-container">
            <div class="logo">SkillQuestX</div>
            <div class="welcome-text">REDEFINE | UPSKILL | SUCCEED</div>
            <div class="subtitle">Welcome to SkillQuestX – Upskill for the Future</div>
            <a href="https://skillquestx.com" class="quest-button" target="_blank">Start Your Quest</a>
            
            <div class="skill-icons">
                <div class="skill-icon">💻</div>
                <div class="skill-icon">🎯</div>
                <div class="skill-icon">🚀</div>
                <div class="skill-icon">⭐</div>
            </div>
        </div>

        <script>
            // Add some interactive sparkle effect
            document.addEventListener('mousemove', (e) => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'absolute';
                sparkle.style.left = e.clientX + 'px';
                sparkle.style.top = e.clientY + 'px';
                sparkle.style.width = '4px';
                sparkle.style.height = '4px';
                sparkle.style.background = 'rgba(255, 255, 255, 0.8)';
                sparkle.style.borderRadius = '50%';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'sparkle 1s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            });

            // Add sparkle animation
            const style = document.createElement('style');
            style.textContent = \`
                @keyframes sparkle {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            \`;
            document.head.appendChild(style);
        </script>
    </body>
    </html>
    `;

    res.send(welcomeHTML);
});

// Start server
const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || 'https://api.skillquestx.com';

app.listen(port, () => {
    console.log(`Server running at ${host}/welcome`);
});
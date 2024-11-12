import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "gkkartik2nd@gmail.com",
    pass: "pbovvuzcmkdwfjhm", // Make sure to use environment variables for sensitive data
  },
});

export const signUpMailSender = async (email, name) => {
  const subject = "Welcome to Pet Marketplace! 🐾";
  const text = `Hello ${name},

Thank you for joining our Pet Marketplace! We’re so excited to have you in our community.

Explore, connect, and find your perfect pet, or share your love for pets by selling. We're here to support you every step of the way!

Best regards,
The Pet Marketplace Team`;

  const html = `
    <p>Hi ${name},</p>
    <p>Thank you for joining <strong>Pet Marketplace</strong>! We’re thrilled to welcome you to our community of passionate pet lovers.</p>
    <p>Here’s what you can do:</p>
    <ul>
      <li><strong>Explore Pets:</strong> Browse a variety of pets looking for a new home.</li>
      <li><strong>Connect with Pet Owners:</strong> Chat with pet owners to learn more about your future furry friend.</li>
      <li><strong>Sell Pets:</strong> List your own pets and find them loving homes.</li>
    </ul>
    <p>We are always here to help! If you have any questions, feel free to reach out at any time.</p>
    <br/>
    <p>Warm regards,</p>
    <h1>Kartik Barman</h1>
    <p><strong>Founder & CEO</strong></p>
    <p>The Pet Marketplace Team</p>
  `;

  await transporter.sendMail({
    from: '"Pet Marketplace" <gkkartik2nd@gmail.com>',
    to: email,
    subject,
    text,
    html,
  });
};

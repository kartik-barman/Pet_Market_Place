import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "gkkartik2nd@gmail.com",
    pass: "pbovvuzcmkdwfjhm",
  },
});

export const sentSubscribeMail = async (email) => {
  const subject = "Welcome to the Pet Marketplace!";
  const text = `Hello,

Thank you for joining our Pet Marketplace!

We’re thrilled to have you in our community of pet lovers. Explore, connect, and find your next furry friend or a new home for a beloved pet.

Best regards,
The Pet Marketplace Team`;

  const html = `
    <p>Hi there,</p>
    <p>Thank you for joining <strong>Pet Marketplace</strong>!</p>
    <p>We’re thrilled to have you in our community of pet lovers. Here’s what you can do:</p>
    <ul>
      <li><strong>Explore Pets:</strong> Browse through a wide selection of pets looking for a home.</li>
      <li><strong>Connect with Pet Owners:</strong> Chat with owners to get to know the pets before adoption.</li>
      <li><strong>Sell Pets:</strong> List your pets and find them loving homes.</li>
    </ul>
    <p>We’re here to help you every step of the way. If you have any questions, feel free to reach out!</p>
    <br/>
    <p>Best regards,</p>
    <h1>Kartik Barman</h1>
    <p>Founder & CEO</p>
    <p><strong>The Pet Marketplace Team</strong></p>
  `;

  await transporter.sendMail({
    from: '"Pet Marketplace" <gkkartik2nd@gmail.com>',
    to: email,
    subject,
    text,
    html,
  });
};

import nodemailer, { Transporter } from "nodemailer";

const nodemailer = require("nodemailer");
const { Transporter } = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // Adjust based on your SMTP server configuration
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

module.exports = { transporter };

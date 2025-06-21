import nodemailer from "nodemailer";

export const createTransporter = () => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    console.log("Nodemailer SMTP_USER:", process.env.SMTP_USER);
    console.log("Nodemailer SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "Loaded" : "Missing");

    return transporter;
};

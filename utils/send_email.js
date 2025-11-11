import { ACCOUNT_EMAIL } from "../config/env.js";
import { emailTemplates } from "./email-template.js";
import dayjs from 'dayjs';;
import { transporter } from "../config/nodemailer.js";

export const sendReminderEmail = async ({
    to,
    type,
    subscription
}) => {
    if (!to || !type) {
        const error = new Error("Missing required parameters in send Email function");
        error.statusCode = 400;
        throw error;
    }

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) {
        const error = new Error("Invalid Email type");
        error.statusCode = 400;
        throw error;
    }

    const accountSettingsLink = "";
    const supportLink = "";
    const supportEmail = ACCOUNT_EMAIL;

    const mailInfo = {
        userName: subscription.user.name,
        userEmail: subscription.user.email,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price}`,
        paymentMethod: subscription.paymentMethod,
        accountSettingsLink: accountSettingsLink,
        supportLink: supportLink,
        subscriptionStartDate: dayjs(subscription.startDate).format("dddd, d MMMM, YYYY"),
        billingCycle: subscription.frequency,
        accountId: subscription._id,
        nextBillingAmount: `${subscription.price} (at ${dayjs(subscription.renewalDate).format("MMM D, YYYY")})`,
        subscriptionStatus: subscription.status,
        supportEmail: supportEmail,
    }

    const message = template.generateBody(mailInfo);

    const emailSubject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: ACCOUNT_EMAIL,
        to: to,
        subject: emailSubject,
        html: message,
    }

    transporter.sendMail(
        mailOptions,
        (error, info) => {
            if (error) return console.log(error, "Error sending email");

            console.log("Email sent: ", info.response)
        }
    )
}
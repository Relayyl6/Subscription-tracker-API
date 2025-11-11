import { serve } from "@upstash/workflow/express";
import subscriptionModel from '../models/subscription.model.js';
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send_email.js";

const REMINDERS = [
    7, 5, 3, 1
]

export const sendReminders = serve(
    async (context) => {
        const { subscriptionId } = context.requestPayload;
        const subscription = await fetchSubscription(context, subscriptionId)
        // console.log(subscription);
        if (!subscription || subscription.status !== "active") return;

        const renewalDate = dayjs(subscription.renewalDate);

        if (renewalDate.isBefore(dayjs())) {
            console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
            return;
        };

        for (const daysBefore of REMINDERS) {
            const reminderDate = renewalDate.subtract(daysBefore, 'day');

            if (reminderDate.isAfter(dayjs())) {
                // sleepfunction until it's ready to be fired
                await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate)
            }

            if (dayjs().isSame(reminderDate, "day")) {
                await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
            }
        }
});

const fetchSubscription = async (context, id) => {
    return await context.run("get subscription", async () => {
        return subscriptionModel.findById(id).populate("user", 'name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return context.run(label, async () => {
        // console.log(`Triggering ${label} reminder`);
        // Send email, SMS, push notification
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}
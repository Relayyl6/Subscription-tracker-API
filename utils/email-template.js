export const generateEmailTemplate = ({
  userName,
  userEmail,
  subscriptionName,
  renewalDate,
  planName,
  price,
  paymentMethod,
  accountSettingsLink,
  supportLink,
  daysLeft,
  subscriptionStartDate,
  billingCycle,
  accountId,
  nextBillingAmount,
  subscriptionStatus,
  supportEmail,
}) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%); text-align: center; padding: 30px;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800; color: #ffffff; margin: 0;">SubDub</p>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td style="padding: 40px 30px;">
                <!-- Added user info section with email and account ID -->
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 14px; color: #666; margin: 0 0 8px;">Account Information</p>
                    <p style="font-size: 16px; margin: 8px 0;"><strong>Hello ${userName}</strong></p>
                    <p style="font-size: 14px; color: #666; margin: 8px 0;">Email: <strong>${userEmail}</strong></p>
                    <p style="font-size: 14px; color: #666; margin: 8px 0;">Account ID: <strong>${accountId}</strong></p>
                </div>
                
                <p style="font-size: 16px; margin-bottom: 25px;">Your <strong>${subscriptionName}</strong> subscription is set to renew on <strong style="color: #4a90e2;">${renewalDate}</strong> (in <strong>${daysLeft} days</strong>).</p>
                
                <!-- Enhanced subscription details grid with more information -->
                <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 10px; margin-bottom: 30px;">
                    <tr>
                        <td style="font-size: 14px; border-bottom: 1px solid #d0e3ff; width: 50%;">
                            <strong>Plan:</strong><br>
                            <span style="color: #4a90e2; font-size: 16px; font-weight: 600;">${planName}</span>
                        </td>
                        <td style="font-size: 14px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Status:</strong><br>
                            <span style="color: #22863a; font-weight: 600;">${subscriptionStatus}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Price:</strong><br>
                            <span style="color: #4a90e2; font-size: 16px; font-weight: 600;">${price}</span>
                        </td>
                        <td style="font-size: 14px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Next Billing:</strong><br>
                            <span style="color: #4a90e2; font-size: 16px; font-weight: 600;">${nextBillingAmount}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Billing Cycle:</strong><br>
                            <span>${billingCycle}</span>
                        </td>
                        <td style="font-size: 14px; border-bottom: 1px solid #d0e3ff;">
                            <strong>Payment Method:</strong><br>
                            <span>${paymentMethod}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="font-size: 14px;">
                            <strong>Member Since:</strong><br>
                            <span>${subscriptionStartDate}</span>
                        </td>
                    </tr>
                </table>
                
                <!-- Action Links -->
                <table cellpadding="10" cellspacing="0" border="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                        <td style="text-align: center;">
                            <a href="${accountSettingsLink}" style="display: inline-block; background-color: #4a90e2; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">Manage Subscription</a>
                        </td>
                    </tr>
                </table>
                
                <p style="font-size: 15px; margin-bottom: 25px; line-height: 1.8;">If you'd like to make changes, upgrade, downgrade, or cancel your subscription, please visit your <a href="${accountSettingsLink}" style="color: #4a90e2; text-decoration: underline;">account settings</a> before the renewal date.</p>
                
                <!-- Added help section with email and link options -->
                <div style="background-color: #fffbf0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 20px;">
                    <p style="font-size: 15px; margin: 0 0 10px;"><strong>Need Help?</strong></p>
                    <p style="font-size: 14px; margin: 0;">Contact our support team at <a href="mailto:${supportEmail}" style="color: #4a90e2; text-decoration: none;">${supportEmail}</a> or visit our <a href="${supportLink}" style="color: #4a90e2; text-decoration: none;">support center</a> anytime.</p>
                </div>
                
                <p style="font-size: 15px; margin-top: 30px; color: #666;">
                    Best regards,<br>
                    <strong style="color: #4a90e2;">The SubDub Team</strong>
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f0f7ff; padding: 25px; text-align: center; font-size: 13px; color: #666;">
                <p style="margin: 0 0 12px;">
                    <strong>SubDub Inc.</strong> | 123 Main St, Anytown, AN 12345
                </p>
                <p style="margin: 0;">
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
`

export const emailTemplates = [
  {
    label: "7 days before reminder",
    generateSubject: (data) => `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
  },
  {
    label: "5 days before reminder",
    generateSubject: (data) => `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
  },
  {
    label: "2 days before reminder",
    generateSubject: (data) => `🚀 2 Days Left! ${data.subscriptionName} Subscription Renewal`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
  },
  {
    label: "1 days before reminder",
    generateSubject: (data) => `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
    generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
]
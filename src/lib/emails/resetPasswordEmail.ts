export const resetPasswordEmail = (resetPasswordURL: string) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #7C3AED; font-size: 24px; font-weight: 600; margin-bottom: 8px;">
          Tiny Portals
        </h1>
        <hr style="border-color: #F3F4F6;" />
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">
          Password Reset Request
        </h2>
        <p style="color: #6B7280; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to set up a new password:
        </p>
        
        <a href="${resetPasswordURL}" 
          style="display: inline-block; background-color: #7C3AED; color: white; padding: 12px 24px; 
                border-radius: 6px; text-decoration: none; font-weight: 500; margin-bottom: 24px;">
          Reset Password
        </a>

        <p style="color: #6B7280; font-size: 14px;">
          If you didn't request this password reset, you can safely ignore this email. This link will expire in 1 hour.
        </p>
      </div>

      <div style="text-align: center; color: #9CA3AF; font-size: 14px; padding-top: 24px; border-top: 1px solid #F3F4F6;">
        <p>© ${new Date().getFullYear()} Tiny Portals. All rights reserved.</p>
        <p style="margin-top: 8px;">
          Need help? Contact our <a href="mailto:support@tinyportals.com" style="color: #7C3AED; text-decoration: underline;">support team</a>
        </p>
      </div>
    </div>
  `
}

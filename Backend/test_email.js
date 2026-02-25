require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length, 'chars');
console.log('EMAIL_PASS starts with PASTE_:', process.env.EMAIL_PASS?.startsWith('PASTE_'));

async function testEmail() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log('\n🔄 Verifying Gmail credentials...');
        await transporter.verify();
        console.log('✅ Gmail credentials are VALID!');

        console.log('\n📧 Sending test OTP email...');
        const info = await transporter.sendMail({
            from: `"CleanStreet Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'CleanStreet OTP Test — 123456',
            html: '<h2>Test OTP: <strong>123456</strong></h2><p>If you receive this, Gmail SMTP is working!</p>',
        });
        console.log('✅ Email sent successfully! Message ID:', info.messageId);
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.code) console.error('   Code:', err.code);
        if (err.response) console.error('   SMTP Response:', err.response);
    }
}

testEmail();

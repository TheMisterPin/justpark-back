import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'claudine.west@ethereal.email',
    pass: 'nSWYySSskfSxJvfjdY'
  }
})


export const sendPasswordResetEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: "justPark@server.com",
    to: to,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: 
    ${process.env.API_URL}/reset-password/${token}`
  }

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: 'justPark@server.com',
    to,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: 
    ${process.env.API_URL}/reset-password/${token}`,
  }

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

export const sendEmailReciept = async (to: string, data: ParkingSessionInfo) => {
  const {
    parkingName, startTime, endTime, id,
  } = data
  const mailOptions = {
    from: 'justPark@server.com',
    to,
    subject: 'Your Parking Reciept',
    text: `Thank you for choosing Jutpark! Your car is parked at : ${parkingName}
    from ${startTime} to ${endTime} if you wish to change your stay, you can do so at: ${process.env.API_URL}/sessions/${id}`,
  }

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}

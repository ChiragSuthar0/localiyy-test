const nodemailer = require("nodemailer");
import User from "../../schema/User";

// Configuration for nodemailer (replace with your email service details)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "650185cc292fe3",
    pass: "1f1c8eca7abde9",
  },
});

// Generate OTP
function generateOTP(): number {
  return Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
}

// Store OTPs temporarily (in real scenarios, use databases or better storage)
const otpStore: { [email: string]: number } = {};

// Function to send OTP to the user's email
async function sendOTP(req: any, res: any): Promise<void> {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("duplicate error");
      res
        .status(409)
        .json({ error: "Email address already exists in the system" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Internal server error: cannot validate uniqueness of email requesting to be registeres",
    });
  }

  // Generate OTP
  const otp: number = generateOTP();

  const verificationLink = `http://localhost:4200/verify-otp?otp=${otp}&email=${email}`;

  // Save OTP in temporary storage (you might want to use a more secure storage in a real application)
  otpStore[email] = otp;

  // Sending OTP to the user's email
  const mailOptions = {
    from: "your_email@gmail.com", // Replace with your email
    to: email,
    subject: "One-Time Password (OTP) for Registration",
    text: `Click <a href="${verificationLink}">here</a> to verify your email.`,
  };

  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending OTP" });
    } else {
      console.log("OTP sent:", info.response);
      res.status(200).json({ message: "Verification Link Sent successfully" });
    }
  });
}

// Function to verify OTP
async function verifyOTP(req: any, res: any): Promise<void> {
  const { email, otp } = req.query;
  const storedOTP: number | undefined = otpStore[email];

  if (storedOTP && storedOTP.toString() === otp.toString()) {
    delete otpStore[email];

    try {
      await User.findOneAndUpdate(
        { email: email },
        {
          active: true,
          createdAt: Date.now(),
        }
      );
      res.status(200).json({ message: "Registration successful." });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Registration failed. Internal server error" });
    }
  } else {
    res.status(400).json({ error: "Invalid OTP. Registration failed." });
  }
}

export { verifyOTP, sendOTP };

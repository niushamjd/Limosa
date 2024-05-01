import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
// Assuming the sendEmail function is exported from mailer.js
import { sendEmail } from "../utils/mailer.js"; // Ensure this path is correct

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      photo: req.body.photo,
    });
    const savedUser = await newUser.save();

    // Email content
    const formattedMessage = `
      Welcome ${savedUser.username},
      Your account has been successfully created. Please wait for approval.
    `;

    // Email params
    const params = {
        Destination: {
            ToAddresses: [savedUser.email], // Send to the registered user's email
        },
        Message: {
            Body: {
                Text: { Data: formattedMessage },
            },
            Subject: { Data: 'Account Registration Successful' },
        },
        Source: 'prosmarttravel@gmail.com', // Replace with your email
    };

    // Send email
    try {
        sendEmail(params);
        res.status(200).json({ success: true, message: "Successfully registered. Please check your email." });
    } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Consider how you want to handle email errors; e.g., log the error but still consider registration successful
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed. Try again." });
  }
};


// user login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // if user does not exist
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if account is currently locked
    const now = Date.now();
    if (user.lockUntil && user.lockUntil > now) {
      return res.status(403).json({ success: false, message: "Account is temporarily locked due to multiple unsuccessful login attempts. Please try again later." });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // if password is incorrect
    if (!isPasswordCorrect) {
      user.failedLoginAttempts += 1; // Increment failed attempts

      if (user.failedLoginAttempts >= 10) {
        // Lock the account for 1 hour and reset failed login attempts
        user.lockUntil = now + 60 * 60 * 1000; // 1 hour in milliseconds
        user.failedLoginAttempts = 0; // Reset attempts immediately upon lock
        await user.save();
        return res.status(403).json({ success: false, message: "Account is temporarily locked due to multiple unsuccessful login attempts. Please try again later." });
      } else {
        await user.save();
        return res.status(401).json({ success: false, message: "Incorrect email or password" });
      }
    }

    // If password is correct
    if (isPasswordCorrect) {
      user.failedLoginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15d" }
      );

      // Set token in the browser cookies and send response to client
      res.cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      });

      const { password, ...rest } = user._doc;

      return res.status(200).json({
        success: true,
        token,
        data: rest,
        role: user.role,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Failed to login. Error: " + error.message });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req, res) => {
  const { token } = req.body;  // This is the JWT token sent from the frontend

  try {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,  // Ensure this matches your Google client ID
      });

      const payload = ticket.getPayload();
      const { sub, email, name, picture } = payload;  // Extract information from the payload

      let user = await User.findOne({ email });

      if (!user) {
          // If user does not exist, create a new user
          user = new User({
              username: name,
              email: email,
              password: '',  // Consider a way to handle password for Google authenticated users
              photo: picture
          });

          await user.save();
      }

      // Generate a token for the user
      const userToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "15d" }
      );

      // Optionally set the token in a cookie
      res.cookie("accessToken", userToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)  // 15 days
      });
      const { password, ...rest } = user._doc;
      res.status(200).json({
          success: true,
          token: userToken,
          data: rest,
        role: user.role,
      });

  } catch (error) {
      console.error("Error authenticating Google token: ", error);
      res.status(401).json({ success: false, message: "Invalid authentication token" });
  }
};
// In authController.js or a similar controller file
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const resetToken = user.getResetPasswordToken();
      await user.save();

      const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
      const formattedMessage = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

      // Ensure this matches the structure expected by your sendEmail function
      const params = {
          Destination: {
              ToAddresses: [user.email],
          },
          Message: {
              Body: {
                  Text: { Data: formattedMessage },
              },
              Subject: { Data: 'Password reset token' },
          },
          Source: 'prosmarttravel@gmail.com',
      };

      await sendEmail(params);
      res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Email could not be sent" });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    console.log(token); // Add this log statement
    // Find user by resetPasswordToken and check if token has expired
    const user = await User.findOne({
      resetPasswordToken: token,
    });
    console.log("User found:", user); // Add this log statement

    if (!user) {
      console.log("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired password reset token" });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(newPassword, salt);

    // Update user's password and clear resetPasswordToken and resetPasswordExpire
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("Password reset successful"); // Add this log statement
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error); // Add this log statement
    res.status(500).json({ message: "Error resetting password" });
  }
};
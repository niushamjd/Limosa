import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        await sendEmail(params);
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
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });

    // if user does not exist
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    // if user exists
    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //if password is incorrect
    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const { password, role, ...rest } = user._doc;

    //create jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    //set token in the browser cookies and send response to client
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to login" });
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
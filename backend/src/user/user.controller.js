import UserModel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "./urils/mail.js";
import { otpTemplate } from "./urils/otp.template.js";
import { generateOtp } from "./urils/generateotp.js";

/* =========================
   SIGNUP CONTROLLER
========================= */
export const createUser = async (req, res) => {
  try {
    let { fullname, email, mobile, password } = req.body;

    email = email.toLowerCase();

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email or mobile",
      });
    }

    // ❌ bcrypt hash yaha SE HATA DO
    const user = new UserModel({
      fullname,
      email,
      mobile,
      password, // plain password
    });

    await user.save(); // 👈 yaha model hash karega

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   SEND OTP
========================= */
export const sendEmail = async (req, res) => {
  try {
    let { email } = req.body;

    email = email.toLowerCase();

    const OTP = generateOtp();

    await sendMail(email, "OTP for Signup", otpTemplate(OTP));

    res.json({
      success: true,
      message: "Email sent successfully",
      otp: OTP, // ⚠️ testing only (prod me mat bhejna)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGIN CONTROLLER
========================= */
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.AUTH_SECRET,
    { expiresIn: "1d" }
  );
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ email normalize
    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const token = createToken(user);
    res.cookie("authToken", token, {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false,      // localhost
  sameSite: "lax"     // ⭐ MUST
});
 

    res.json({message: "Login success",role:user.role});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User does not exist" });
    const token = await jwt.sign({id:user._id},process.env.FORGOT_TOKEN_SECRET,{expiresIn:"15m"});
    

    return res.json({
      success: true,
      message: "Password reset link sent (dummy response)"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


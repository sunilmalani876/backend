
const { fieldValidator } = require("../../helper/fieldvalidator.helper");
const User = require("../../models/user.model");
const crypto = require("crypto");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require("../../utils/ApiResponse");
const { transporter } = require("../../utils/nodemailer");
const { otpGenerator } = require("../../utils/otpGenerator");

const userRegister = async (req, res) => {
  try {
    if (!req.user || !req.user?._id)
      throw new ApiError(401, "unauthorized user");

    const validFields = ["name", "email", "password"];
    const requestedFields = req.body;

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} are invalid, ${
          missingFields ? missingFields : ""
        } are missing`
      );

    if (
      await User.findOne({
        name: requestedFields.name,
        email: requestedFields.email,
      })
    )
      throw new ApiError(409, "user already exists with name and email");

    const otp = otpGenerator();
    const userId = crypto.randomUUID();
    const newUser = await User.create({ otp, userId, ...requestedFields });

    if (!newUser) throw new ApiError(500, "user creation unsuccessful");

    const mailOptions = {
      from: process.env.EMAIL || "",
      to: newUser.email,
      subject: "Account Verification OTP",
      text: `Name: ${newUser.name}\nEmail: ${newUser.email}\nMessage: Your OTP ${otp}`,
    };
    await transporter.send(mailOptions);

    return res
      .status(201)
      .send(
        new ApiResponse(
          201,
          { name: newUser.name, email: newUser.email },
          "user registered successfully, please verify your account"
        )
      );
  } catch (error) {
    console.error("error occured :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(
        new ApiError(
          error?.statusCode || 500,
          error?.message || "internal server error"
        )
      );
  }
};

module.exports = { userRegister };


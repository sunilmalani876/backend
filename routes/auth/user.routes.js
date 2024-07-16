const {
  userRegister,
  verifyAccount,
  userLogin,
} = require("../../controllers/auth/user.controller");

const router = require("express").Router();

router.route("/sign-up").post(userRegister);
router.route("/verify-account").post(verifyAccount);
router.route("/sign-in").post(userLogin);

module.exports = { router };

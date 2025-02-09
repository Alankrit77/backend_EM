const { response } = require("express");
const adminModel = require("../models/adminModel");
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/tokenCreate");
const bcrpty = require("bcrypt");

class authControllers {
  admin_login = async (req, res) => {
    // console.log("body", req.body);
    const { email, password } = req.body;

    try {
      const admin = await adminModel
        .findOne({
          email,
        })
        .select("+password");
      // console.log("admin", admin);
      if (admin) {
        const matchPassword = await bcrpty.compare(password, admin.password);
        console.log("match", matchPassword);

        if (matchPassword) {
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  //end Method

  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        console.log("seller info");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new authControllers();

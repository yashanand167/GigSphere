import { prisma } from "../../database/db/db.connect.js";
import passport from "passport";

export const createUser = async (req, res) => {
  const [email, username, password, firstname, lastname, role] = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "User already exist",
    });
  }

  const existingEmail = await prisma.email.findOne({
    where: { email },
  });

  if (existingEmail) {
    return res.status(409).json({
      message: "User with email already exists",
    });
  }

  const createUser = await prisma.user.create({
    where: {
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email
    }
  })

  return res.status(200).json({
    message: "User created successfully"
  })
};

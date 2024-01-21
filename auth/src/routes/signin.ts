import express, { Request, Response } from "express";
import { body } from "express-validator"; //Middleware that validate the data that came on body from web
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@eyaltickets/common";
import { User } from "../models/users";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"), //middleware 1
    body("password")
      .trim()
      .notEmpty()
      .withMessage("you must supply a password"),
  ],
  validateRequest, //middleware 2
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credential");
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    ); //compare hush password vs not hash password

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credential");
    }
    // Generate JWT
    const userJwt = jwt.sign(
      //cookie info
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    //Store it on session object
    req.session = { jwt: userJwt }; //create cookie for user
    res.status(200).send(existingUser);
  }
);

export { router as singinRouter };

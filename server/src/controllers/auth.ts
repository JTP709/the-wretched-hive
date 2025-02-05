import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../model/User';
import { handleErrors } from '../utils';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';
const TOKEN_EXPIRATION = '1h';

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password ) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" })
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    
    res.status(201)
      .json({
        message: "User created successfully",
        user: { id: newUser.id, username: newUser.username},
      });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({ message: 'Login successful', token });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const logout = (_: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logout successful' });
};

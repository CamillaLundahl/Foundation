import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTRERA NY ANVÄNDARE
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Kryptera lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Användare skapad!' });
  } catch (error) {
    res.status(500).json({ message: 'Kunde inte skapa användare (namnet kan vara upptaget)' });
  }
};

// LOGGA IN
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Hitta användaren
    const user: any = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    // Jämför lösenordet med det krypterade i databasen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    // Skapa en JWT-token (din inloggningsnyckel)
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'hemlighet', 
      { expiresIn: '1h' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid inloggning' });
  }
};

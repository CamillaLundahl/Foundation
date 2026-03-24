import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTRERA NY ANVÄNDARE
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 1. Kryptera lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Skapa den nya användaren
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    // 3. Skapa en JWT-token direkt (logga in användaren automatiskt)
    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET || 'hemlighet', 
      { expiresIn: '30d' }
    );

    // 4. Skicka tillbaka token och användarnamn
    res.status(201).json({ 
      token, 
      username: newUser.username,
      message: 'Användare skapad och inloggad!' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Kunde inte skapa användare (namnet kan vara upptaget)' });
  }
};

// LOGGA IN
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user: any = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'hemlighet', 
      { expiresIn: '30d' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid inloggning' });
  }
};

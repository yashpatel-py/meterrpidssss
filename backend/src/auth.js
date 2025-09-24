import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TOKEN_TTL = process.env.JWT_EXPIRES_IN || '2h';

export function hashPassword(plain) {
  const saltRounds = process.env.BCRYPT_SALT_ROUNDS ? Number(process.env.BCRYPT_SALT_ROUNDS) : 12;
  return bcrypt.hash(plain, saltRounds);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, secret);
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

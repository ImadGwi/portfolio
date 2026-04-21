import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'super-secret-dev-key-change-me-in-prod';
  return new TextEncoder().encode(secret);
};

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(getSecretKey());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

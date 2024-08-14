import bcrypt from "bcrypt";
import crypto from "crypto";

export interface ApiResponse {
  status: number;
  message: string;
}

export interface ApiResponseWithData extends ApiResponse {
  data?: string | object;
}

export interface ApiResponseWithError extends ApiResponse {
  error?: Error | string;
}

export const getApiResponse = (message: string): ApiResponse => {
  return { status: 0, message };
};

export const getApiResponseWithData = (
  message: string,
  data: string | object
): ApiResponseWithData => {
  return { status: 0, message, data };
};

export const getApiResponseWithError = (
  message: string,
  error: Error
): ApiResponseWithError => {
  return { status: 0, message, error: error.message };
};

export const encrypt = (text: string, key: Buffer): string => {
  const iv = crypto.randomBytes(16); // Generate random initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

export const decrypt = (encryptedText: string, key: Buffer): string => {
  const [ivString, encryptedData] = encryptedText.split(':');
  const iv = Buffer.from(ivString, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const generateHash = (passwordPlainText: string): string => {
  return bcrypt.hashSync(passwordPlainText, 4);
};

export const validateHash = (
  passwordPlainText: string,
  passwordHash: string
): boolean => {
  return bcrypt.compareSync(passwordPlainText, passwordHash);
};


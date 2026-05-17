import jwt from "jsonwebtoken";

export const generateJWT = async ({
  userId,
  secret,
  limit,
}: {
  userId: string;
  secret: string;
  limit: number;
}) => {
  const token = await jwt.sign({ id: userId }, secret, {
    expiresIn: limit,
  });

  return token;
};

// Random OTP generate function
const alphas = "ABCDEFGHIJ";
const numbers = "1234567890";
const genRandomNum = () => Math.floor(Math.random() * 10);

export const generateCode = () => {
  let code = "";

  for (let i = 0; i < 3; i++) {
    code += alphas[genRandomNum()];
  }
  for (let i = 0; i < 3; i++) {
    code += numbers[genRandomNum()];
  }

  return code;
};

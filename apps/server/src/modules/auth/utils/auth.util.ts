import jwt from "jsonwebtoken";

export const generateJWT = async ({
  userId,
  userRole,
  userEmail,
  secret,
  limit,
}: {
  userId: string;
  userRole: "USER" | "ADMIN";
  userEmail: string;
  secret: string;
  limit: number;
}) => {
  const token = await jwt.sign(
    { id: userId, email: userEmail, role: userRole },
    secret,
    {
      expiresIn: limit,
    },
  );

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

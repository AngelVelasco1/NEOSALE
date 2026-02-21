import crypto from "crypto";

const parsedExpiration = Number(
  process.env.RESET_TOKEN_EXPIRATION_MINUTES ||
    process.env.NEXT_PUBLIC_RESET_TOKEN_EXPIRATION_MINUTES ||
    "15"
);

export const RESET_TOKEN_EXPIRATION_MINUTES =
  Number.isFinite(parsedExpiration) && parsedExpiration > 0 ? parsedExpiration : 15;

const RESET_TOKEN_SECRET =
  process.env.PASSWORD_RESET_SECRET || process.env.NEXTAUTH_SECRET || "local-dev-secret";

export type ResetTokenPayload = {
  userId: number;
  email: string;
  expiresAt: number;
  nonce: string;
};

const encodePayload = (payload: ResetTokenPayload): string => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", RESET_TOKEN_SECRET).update(encoded).digest("hex");
  return `${encoded}.${signature}`;
};

export const createResetToken = (userId: number, email: string) => {
  const expiresAt = Date.now() + RESET_TOKEN_EXPIRATION_MINUTES * 60 * 1000;
  const payload: ResetTokenPayload = {
    userId,
    email,
    expiresAt,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  return {
    token: encodePayload(payload),
    payload,
  };
};

export const decodeResetToken = (token: string): ResetTokenPayload | null => {
  try {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = crypto.createHmac("sha256", RESET_TOKEN_SECRET).update(encodedPayload).digest("hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return null;
    }

    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as ResetTokenPayload;

    return payload;
  } catch (error) {
    
    return null;
  }
};

export const isResetTokenExpired = (payload: Pick<ResetTokenPayload, "expiresAt">): boolean => {
  if (!payload.expiresAt) {
    return true;
  }

  return payload.expiresAt <= Date.now();
};

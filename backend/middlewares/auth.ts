import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/errorsClass.js";

/**
 * Extended Request with user context
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: "user" | "admin" | "staff";
        email?: string;
      };
    }
  }
}

/**
 * Middleware: Extract and validate user from Authorization header
 * Expected format: "Bearer {userId}:{role}"
 * Usage: authentication(req, res, next)
 */
export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Authorization header is required");
    }

    // Extract Bearer token
    const [scheme, credentials] = authHeader.split(" ");

    if (scheme !== "Bearer") {
      throw new UnauthorizedError("Invalid authorization scheme");
    }

    if (!credentials) {
      throw new UnauthorizedError("Missing credentials");
    }

    // Parse userId:role format OR just userId
    const [userIdStr, role] = credentials.split(":");
    const userId = parseInt(userIdStr, 10);

    if (isNaN(userId) || userId <= 0) {
      throw new UnauthorizedError("Invalid user ID");
    }

    // Attach user to request
    req.user = {
      id: userId,
      role: (role as "user" | "admin" | "staff") || "user",
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Authorize based on roles
 * Usage: authorize("admin")(req, res, next) or authorize("admin", "staff")(req, res, next)
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User not authenticated");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.user.role}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Combined middleware for common admin pattern
 * Usage: authenticateAdmin(req, res, next)
 */
export const authenticateAdmin = [
  authentication,
  authorize("admin"),
];

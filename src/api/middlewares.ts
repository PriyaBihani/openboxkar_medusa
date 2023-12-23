import type {
  MiddlewaresConfig,
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/medusa";
import { UserService } from "@medusajs/medusa";
import { User } from "./../models/user";
import { authenticate } from "@medusajs/medusa";

async function registerLoggedInUser(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  console.log("HERE ========== inside the middleware");
  let loggedInUser: User | null = null;
  console.log(req.user);
  if (req.user && req.user.userId) {
    const userService = req.scope.resolve("userService") as UserService;
    loggedInUser = await userService.retrieve(req.user.userId);
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
    },
  });

  next();
}

async function logger(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  console.log("Request received");
  next();
}

async function errorHandler(
  error: any,
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  console.log("Error handler, error");
  next();
}

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: /^\/admin(?!\/auth)/,
      middlewares: [authenticate(), registerLoggedInUser],
    },
    {
      matcher: "/store/custom",
      middlewares: [logger],
    },
  ],
  errorHandler: errorHandler,
};

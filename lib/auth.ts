import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true, 
      }, 
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // refresh every 1 day
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // 5 minutes
        }
      },
    plugins: [nextCookies()],
    trustedOrigins: [
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      ],
    
});
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signInUser = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(), // Critical for setting cookies!
    });

    return {
      success: true,
      message: "User signed in successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error signing in user",
    };
  }
};

export const signUpUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "User signed up successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error signing up user",
    };
  }
};

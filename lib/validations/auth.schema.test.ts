import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./auth.schema";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "jan@example.com",
      password: "haslo123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "niepoprawny",
      password: "haslo123",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("requires displayName min 2 chars", () => {
    const result = registerSchema.safeParse({
      email: "jan@example.com",
      password: "haslo123",
      displayName: "J",
    });
    expect(result.success).toBe(false);
  });
});

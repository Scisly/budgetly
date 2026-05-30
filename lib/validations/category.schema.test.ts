import { describe, it, expect } from "vitest";
import { categorySchema } from "./category.schema";

describe("categorySchema", () => {
  it("accepts valid category data", () => {
    const result = categorySchema.safeParse({
      name: "Jedzenie",
      color: "#ef4444",
      icon: "utensils",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid hex color", () => {
    const result = categorySchema.safeParse({
      name: "Jedzenie",
      color: "red",
      icon: "utensils",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = categorySchema.safeParse({
      name: "",
      color: "#ef4444",
      icon: "utensils",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty icon", () => {
    const result = categorySchema.safeParse({
      name: "Jedzenie",
      color: "#ef4444",
      icon: "",
    });
    expect(result.success).toBe(false);
  });
});

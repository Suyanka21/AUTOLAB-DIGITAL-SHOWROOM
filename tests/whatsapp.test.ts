import { describe, expect, it } from "vitest";
import { buildWhatsAppHref } from "../src/lib/whatsapp";

describe("WhatsApp link builder", () => {
  it("encodes the consultation text for a configured number", () => {
    expect(buildWhatsAppHref("254712345678", "Hello AutoLab & team"))
      .toBe("https://wa.me/254712345678?text=Hello%20AutoLab%20%26%20team");
  });

  it("returns null for an unset number", () => {
    expect(buildWhatsAppHref(undefined, "Hello")).toBeNull();
  });

  it.each(["", "254 712 345678", "+254712345678", "abc", "0000000000", "123"])(
    "returns null for malformed number %j",
    (number) => expect(buildWhatsAppHref(number, "Hello")).toBeNull(),
  );
});

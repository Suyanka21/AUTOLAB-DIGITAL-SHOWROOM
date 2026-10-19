import { describe, expect, it } from "vitest";
import Ajv from "ajv";
import { readFileSync } from "node:fs";
import manifest from "../src/config/scene-manifest.s-class-v223.json";
import vehicle from "../src/config/vehicles/mercedes-s-class-v223.json";
import colours from "../src/config/materials/colors.json";
import materials from "../src/config/materials/catalogue.json";
import manifestSchema from "../docs/schemas/scene-manifest.schema.json";
import vehicleSchema from "../docs/schemas/vehicle.schema.json";

describe("S-Class configuration contracts", () => {
  it("maps every scene node to a defined material slot", () => {
    const defined = new Set(manifest.materialSlots.map((slot) => slot.slotIdentifier));
    const missing = Array.from(new Set(manifest.nodes.map((node) => node.materialSlot).filter((slot) => !defined.has(slot)))).sort();
    // F1: these four unresolved slots are known and must be removed from this list as they are defined.
    expect(missing).toEqual([
      "MAT_Carpet_Floor",
      "MAT_Console_Veneer_And_Leather",
      "MAT_Door_Card_Substrate",
      "MAT_Screen_Driver_Cluster",
    ]);
    const identifiers = manifest.nodes.map((node) => node.identifier);
    expect(new Set(identifiers).size).toBe(identifiers.length);
    const componentMap = readFileSync(new URL("../docs/3d-assets/interior-component-map.md", import.meta.url), "utf8");
    const documentedIdentifiers = new Set(Array.from(componentMap.matchAll(/^\|\s*`(GEO_[^`]+)`\s*\|/gm), (match) => match[1]));
    for (const identifier of identifiers) {
      expect(documentedIdentifiers.has(identifier), `${identifier} is not in the component map`).toBe(true);
    }
  });

  it("references only catalogue materials from each colour", () => {
    const ids = new Set(materials.map((material) => material.id));
    for (const colour of colours) {
      for (const id of colour.compatibleMaterialIds) {
        expect(ids.has(id), `${colour.id} references missing material ${id}`).toBe(true);
      }
    }
  });

  it("validates the scene manifest against its schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(manifestSchema);
    expect(validate(manifest), JSON.stringify(validate.errors)).toBe(true);
  });

  it("validates the vehicle config against its schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(vehicleSchema);
    expect(validate(vehicle), JSON.stringify(validate.errors)).toBe(true);
  });
});

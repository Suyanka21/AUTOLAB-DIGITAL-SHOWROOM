import { describe, expect, it } from "vitest";
import Ajv from "ajv";
import { readFileSync } from "node:fs";
import sClassManifest from "../src/config/scene-manifest.s-class-v223.json";
import sClassVehicle from "../src/config/vehicles/mercedes-s-class-v223.json";
import lexusManifest from "../src/config/scene-manifest.lexus-rx350.json";
import lexusVehicle from "../src/config/vehicles/lexus-rx350-2020.json";
import colours from "../src/config/materials/colors.json";
import materials from "../src/config/materials/catalogue.json";
import manifestSchema from "../docs/schemas/scene-manifest.schema.json";
import vehicleSchema from "../docs/schemas/vehicle.schema.json";

describe("S-Class configuration contracts (Historical Baseline)", () => {
  it("maps every scene node to a defined material slot", () => {
    const defined = new Set(sClassManifest.materialSlots.map((slot) => slot.slotIdentifier));
    const missing = Array.from(new Set(sClassManifest.nodes.map((node) => node.materialSlot).filter((slot) => !defined.has(slot)))).sort();
    // F1: these four unresolved slots are known and must be removed from this list as they are defined.
    expect(missing).toEqual([
      "MAT_Carpet_Floor",
      "MAT_Console_Veneer_And_Leather",
      "MAT_Door_Card_Substrate",
      "MAT_Screen_Driver_Cluster",
    ]);
    const identifiers = sClassManifest.nodes.map((node) => node.identifier);
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
    expect(validate(sClassManifest), JSON.stringify(validate.errors)).toBe(true);
  });

  it("validates the vehicle config against its schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(vehicleSchema);
    expect(validate(sClassVehicle), JSON.stringify(validate.errors)).toBe(true);
  });
});

describe("Lexus RX 350 configuration contracts (Rebaseline Phase L0)", () => {
  it("maps every Lexus scene node to a defined material slot with ZERO missing slots", () => {
    const defined = new Set(lexusManifest.materialSlots.map((slot) => slot.slotIdentifier));
    const missing = Array.from(new Set(lexusManifest.nodes.map((node) => node.materialSlot).filter((slot) => !defined.has(slot)))).sort();
    expect(missing).toEqual([]);

    const identifiers = lexusManifest.nodes.map((node) => node.identifier);
    expect(new Set(identifiers).size).toBe(identifiers.length);
    expect(identifiers).toEqual([
      "GEO_Seat_Front_Driver",
      "GEO_Seat_Front_Passenger",
      "GEO_Seat_Stitching_Front",
      "GEO_SteeringWheel_Lexus",
      "GEO_Dashboard_Lexus",
    ]);
  });

  it("defines the five semantic material zones with zero unresolved slots", () => {
    const slotIds = lexusManifest.materialSlots.map((s) => s.slotIdentifier);
    expect(slotIds).toEqual([
      "MAT_Seat_Primary",
      "MAT_Seat_Secondary",
      "MAT_Seat_Stitching",
      "MAT_Steering_Leather",
      "MAT_Dashboard_Trim",
    ]);
  });

  it("validates the Lexus scene manifest against its schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(manifestSchema);
    expect(validate(lexusManifest), JSON.stringify(validate.errors)).toBe(true);
  });

  it("validates the Lexus vehicle config against its schema", () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(vehicleSchema);
    expect(validate(lexusVehicle), JSON.stringify(validate.errors)).toBe(true);
  });

  it("defines the four bounded camera presets with calibrated viewports", () => {
    const cameraIds = lexusVehicle.cameraPresets.map((preset) => preset.id);
    expect(cameraIds).toEqual([
      "hero_driver",
      "seam_macro",
      "cabin_pair",
      "driver_cockpit",
    ]);
    for (const preset of lexusVehicle.cameraPresets) {
      expect(preset.position).toHaveLength(3);
      expect(preset.target).toHaveLength(3);
      expect(preset.fov).toBeGreaterThan(20);
      expect(preset.fov).toBeLessThan(60);
    }
  });
});

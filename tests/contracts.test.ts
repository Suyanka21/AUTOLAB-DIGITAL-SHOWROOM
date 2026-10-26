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
import { LEXUS_CAMERA_PRESETS } from "../src/config/lexus-camera-presets";
import { SPIKE_CAMERA_PRESETS } from "../src/config/spike-camera-presets";
import { PerspectiveCamera } from "three";

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

  it("preserves the five semantic zones and adds two independent L2B cockpit finishes", () => {
    const slotIds = lexusManifest.materialSlots.map((s) => s.slotIdentifier);
    expect(slotIds).toEqual([
      "MAT_Seat_Primary",
      "MAT_Seat_Secondary",
      "MAT_Seat_Stitching",
      "MAT_Steering_Leather",
      "MAT_Dashboard_Trim",
      "MAT_Cockpit_Accent",
      "MAT_Cockpit_Black",
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

  it("assigns exact calibrated FOVs to all Lexus presets and preserves Mercedes default FOV", () => {
    expect(LEXUS_CAMERA_PRESETS.hero_driver.fov).toBe(38);
    expect(LEXUS_CAMERA_PRESETS.seam_macro.fov).toBe(28);
    expect(LEXUS_CAMERA_PRESETS.cabin_pair.fov).toBe(45);
    expect(LEXUS_CAMERA_PRESETS.driver_cockpit.fov).toBe(42);

    for (const key of Object.keys(SPIKE_CAMERA_PRESETS) as Array<keyof typeof SPIKE_CAMERA_PRESETS>) {
      const preset = SPIKE_CAMERA_PRESETS[key] as { fov?: number };
      expect(preset.fov).toBeUndefined();
    }
  });

  it("updates camera FOV, projection matrix, and transitions safely between all views", () => {
    const camera = new PerspectiveCamera(38, 16 / 9, 0.05, 10);
    camera.updateProjectionMatrix();
    const initialProjection = camera.projectionMatrix.clone();

    const sequence: Array<{ view: string; expectedFov: number }> = [
      { view: "overview", expectedFov: 38 },
      { view: "seam_macro", expectedFov: 28 },
      { view: "cabin_pair", expectedFov: 45 },
      { view: "driver_cockpit", expectedFov: 42 },
      { view: "hero_driver", expectedFov: 38 },
      { view: "seat_detail", expectedFov: 38 },
    ];

    const allPresets: Record<string, { fov?: number; position: readonly [number, number, number]; target: readonly [number, number, number] }> = {
      ...SPIKE_CAMERA_PRESETS,
      ...LEXUS_CAMERA_PRESETS,
    };

    for (const step of sequence) {
      const preset = allPresets[step.view];
      expect(preset).toBeDefined();

      const targetFov = preset.fov ?? 38;
      expect(targetFov).toBe(step.expectedFov);

      camera.position.set(preset.position[0], preset.position[1], preset.position[2]);
      if (camera.fov !== targetFov) {
        camera.fov = targetFov;
      }
      camera.updateProjectionMatrix();

      expect(camera.fov).toBe(step.expectedFov);
      expect(Number.isFinite(camera.projectionMatrix.elements[0])).toBe(true);

      if (step.expectedFov !== 38) {
        expect(camera.projectionMatrix.equals(initialProjection)).toBe(false);
      } else {
        expect(camera.projectionMatrix.elements[0]).toBeCloseTo(initialProjection.elements[0], 5);
      }
    }
  });
});


import { BASE_PATH } from "@/lib/site";

/**
 * One place for the 3D device showcase's assets and tuning (components/3d/laptop/*).
 *
 * Environment: "Studio Small 09" by Sergej Majboroda, Poly Haven, CC0 (no attribution required),
 * https://polyhaven.com/a/studio_small_09, 1K .hdr (md5 d5d7eb9d26d341d6aa4d11c1a54fd97c), box-filtered
 * to 512x256 (410 KB instead of 1.6 MB; the scene bakes it into a 512px cube map at 0.55 intensity, so
 * the full size bought nothing visible). Bundled under public/hdri so the scene never depends on a
 * third-party CDN at runtime.
 *
 * Model: the laptop is procedural (ProceduralLaptop.tsx). No modern laptop model with a verifiable
 * commercial-use licence could be retrieved; replacing it with a GLB means writing a component with the
 * same contract (renders the chassis, exposes the lid group, mounts `screen` on the display) and
 * swapping it in LaptopScene.
 */
export const DEVICE3D = {
  envMap: `${BASE_PATH}/hdri/studio_small_09_512.hdr`,
  envIntensity: 0.55,
  exposure: 1.05,
  /** CSS pixel size of the live screen content (the demo); the display is modelled to this ratio. */
  screenPx: [960, 600] as [number, number],
  /** Device pixel ratio range; the performance monitor lowers it on weak GPUs. */
  dpr: [1, 1.75] as [number, number],
  camera: { fov: 26, position: [-5, 10, 40] as [number, number, number] },
  /** Three-quarter pose (radians): turned so the left side and its ports face the camera. */
  pose: { yaw: 0.3, pitch: 0 },
  /** Lid angle: open leans back ~17°. */
  lid: { open: -0.3 },
  stage: "#0b0e15",
  /** Below this width the demo is shown flat (a 3D-scaled screen would be too small to use). */
  minWidth: 901,
} as const;

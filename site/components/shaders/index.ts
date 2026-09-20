import { caustics } from "./caustics";
import { colorBends } from "./color-bends";
import { glass } from "./glass";
import { lightPillar } from "./light-pillar";
import { lumen } from "./lumen";

export interface HeroShader {
  name: string;
  note: string;
  fallback: string;
  fragment: string;
}

/** The candidates for the hero, in the order they are offered. */
export const HERO_SHADERS: Record<string, HeroShader> = {
  lumen,
  "color-bends": colorBends,
  "light-pillar": lightPillar,
  caustics,
  glass,
};

export type HeroShaderKey = keyof typeof HERO_SHADERS;

/** The one the home page uses until Phil picks another. */
export const DEFAULT_HERO_SHADER: HeroShaderKey = "glass";

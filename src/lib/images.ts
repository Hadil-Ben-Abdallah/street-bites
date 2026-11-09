import bao from "@/assets/food-bao.jpg";
import tacos from "@/assets/food-tacos.jpg";
import takoyaki from "@/assets/food-takoyaki.jpg";
import corndog from "@/assets/food-corndog.jpg";
import burger from "@/assets/food-burger.jpg";
import shawarma from "@/assets/food-shawarma.jpg";
import panipuri from "@/assets/food-panipuri.jpg";
import banhmi from "@/assets/food-banhmi.jpg";
import padkrapao from "@/assets/food-padkrapao.jpg";
import arancini from "@/assets/food-arancini.jpg";
import crowd from "@/assets/festival-crowd.jpg";
import stage from "@/assets/festival-stage.jpg";

export const IMG = {
  bao,
  tacos,
  takoyaki,
  corndog,
  burger,
  shawarma,
  panipuri,
  banhmi,
  padkrapao,
  arancini,
  crowd,
  stage,
} as const;

export type ImgKey = keyof typeof IMG;

/** Which photo best represents each cuisine. */
export const CUISINE_IMG: Record<string, ImgKey> = {
  Japanese: "takoyaki",
  Korean: "corndog",
  Thai: "padkrapao",
  Indian: "panipuri",
  Mexican: "tacos",
  Italian: "arancini",
  Turkish: "shawarma",
  Lebanese: "shawarma",
  Tunisian: "arancini",
  Moroccan: "padkrapao",
  American: "burger",
  Greek: "shawarma",
  Vietnamese: "banhmi",
  Chinese: "bao",
  Brazilian: "arancini",
};

export const imgFor = (key: ImgKey) => IMG[key];

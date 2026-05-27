import banglesImage from "../assets/bangles.png";
import braceletImage from "../assets/bracelet.png";
import cuffBanglesImage from "../assets/cuffbangles.png";
import earringImage from "../assets/earring.png";
import neckpieceImage from "../assets/neckpiece.png";
import ringsImage from "../assets/rings.png";

export const CATEGORY_OPTIONS = [
  {
    id: "rings",
    label: "Rings",
    value: "Rings",
    image: ringsImage,
  },
  {
    id: "bangles",
    label: "Bangles",
    value: "Bangles",
    image: banglesImage,
  },
  {
    id: "earrings",
    label: "Earrings",
    value: "Earrings",
    image: earringImage,
  },
  {
    id: "cuff-bangles",
    label: "Cuff Bangles",
    value: "Cuff Bangles",
    image: cuffBanglesImage,
  },
  {
    id: "bracelets",
    label: "Bracelets",
    value: "Bracelets",
    image: braceletImage,
  },
  {
    id: "neckpieces",
    label: "Neckpieces",
    value: "Neckpieces",
    image: neckpieceImage,
  },
];

const CATEGORY_VALUES = CATEGORY_OPTIONS.reduce((acc, option) => {
  acc[option.id] = option.value;
  return acc;
}, {});

const CATEGORY_LABELS = CATEGORY_OPTIONS.reduce((acc, option) => {
  acc[option.id] = option.label;
  return acc;
}, {});

export const getCategoryValue = (categoryId) =>
  CATEGORY_VALUES[categoryId] || "Bangles";

export const getCategoryLabel = (categoryId) =>
  CATEGORY_LABELS[categoryId] || "Bangles";

export const normalizeCategory = (value) => {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.includes("cuff")) return "Cuff Bangles";
  if (trimmed.includes("bangle")) return "Bangles";
  if (trimmed.includes("ring")) return "Rings";
  if (trimmed.includes("bracelet")) return "Bracelets";
  if (trimmed.includes("earring")) return "Earrings";
  if (trimmed.includes("neck")) return "Neckpieces";
  return "";
};

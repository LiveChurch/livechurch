import type { SlideBackground } from "../types/theme";
import { I18n } from "@/core/i18n/I18n";

export const SLIDE_BACKGROUNDS: SlideBackground[] = [
  {
    id: "pink-glow",
    get name() { return I18n.t("core.backgrounds.pinkGlowName"); },
    backgroundImage: "https://media.giphy.com/media/lKaeQAunM3hZaqsOpj/giphy.gif",
    get description() { return I18n.t("core.backgrounds.pinkGlowDescription"); },
    isAnimated: true,
  },
  {
    id: "mountains",
    get name() { return I18n.t("core.backgrounds.mountainsName"); },
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.mountainsDescription"); },
  },
  {
    id: "church",
    get name() { return I18n.t("core.backgrounds.churchName"); },
    backgroundImage: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.churchDescription"); },
  },
  {
    id: "sky",
    get name() { return I18n.t("core.backgrounds.skyName"); },
    backgroundImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.skyDescription"); },
  },
  {
    id: "ocean",
    get name() { return I18n.t("core.backgrounds.oceanName"); },
    backgroundImage: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.oceanDescription"); },
  },
  {
    id: "forest",
    get name() { return I18n.t("core.backgrounds.forestName"); },
    backgroundImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.forestDescription"); },
  },
  {
    id: "sunset",
    get name() { return I18n.t("core.backgrounds.sunsetName"); },
    backgroundImage: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.sunsetDescription"); },
  },
  {
    id: "cosmic",
    get name() { return I18n.t("core.backgrounds.cosmicName"); },
    backgroundImage: "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=500&auto=format&fit=crop",
    get description() { return I18n.t("core.backgrounds.cosmicDescription"); },
  },
];

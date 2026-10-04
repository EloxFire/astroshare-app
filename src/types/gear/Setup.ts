import { Telescope } from "./Telescope";
import { Mount } from "./Mount";
import { Eyepiece } from "./Eyepiece";
import { Filter } from "./Filter";
import { Camera } from "./Camera";
import { GuideScope } from "./GuideScope";
import { Focuser } from "./Focuser";

export type Setup = {
  id: string; // custom id
  name: string;
  description: string | null;
  scope: Telescope | null;
  mount: Mount | null;
  eyepieces: Eyepiece[];
  filters: Filter[];
  cameras: Camera[];
  guideScope: GuideScope;
  guideCamera: Camera | null;
  focusers: Focuser[];
}
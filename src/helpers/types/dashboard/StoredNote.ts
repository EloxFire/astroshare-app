import { ObservationFlags } from "./ObservationFlags";

export type StoredNote = {
  objectId?: string;
  objectName?: string;
  objectType?: string;
  objectTypeDetail?: string;
  messierNumber?: number;
  magnitude?: number;
  notes?: string;
  flags?: ObservationFlags;
  observed?: boolean;
  photographed?: boolean;
  sketched?: boolean;
  updatedAt?: string;
};
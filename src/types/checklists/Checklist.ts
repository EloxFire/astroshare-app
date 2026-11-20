export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
}

export type Checklist = {
  id: string;
  name: string;
  description: string | null; // facultative à la création
  items: ChecklistItem[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

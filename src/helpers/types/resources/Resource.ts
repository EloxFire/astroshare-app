export interface Resource {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  downloadLink: string;
  fileType: string;
  content: string;
  level: number;
  visible: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  illustrationUrl?: string;
  subcategory?: string;
}
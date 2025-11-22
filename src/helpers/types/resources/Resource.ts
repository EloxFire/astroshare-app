export interface Resource {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  fileType: string;
  content: string;
  level: number;
  visible: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  pdfUrl?: string;
  memoUrl?: string;
  illustrationUrl?: string;
  subcategory?: string;
}
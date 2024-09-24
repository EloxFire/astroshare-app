export type NewsLog = {
  version: string;
  date: Date;
  changes: string[];
  breaking: boolean;
  version_name?: string;
}
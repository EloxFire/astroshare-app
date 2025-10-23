export type NewsLog = {
  version: string;
  date: Date;
  changes: string[];
  breaking: boolean;
  visible: boolean;
  version_name?: string;
}
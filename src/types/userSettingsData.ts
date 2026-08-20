export type UserSettingsData = {
  nightMode: false | true;
  locale: string;
  pinnedTools: [string?, string?, string?, string?, string?]; // Max 5 outils épinglés
}
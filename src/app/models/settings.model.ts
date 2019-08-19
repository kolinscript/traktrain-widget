export interface SettingsContent {
  widgetID: number;
}

export interface Settings {
  width: string;
  autoWidth: boolean;
  height: string;
  autoHeight: boolean;
  background: string;
  text: string;
  active: string;
  accent?: string;
}

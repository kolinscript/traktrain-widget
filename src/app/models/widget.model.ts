export interface Widget {
  id_widget: number;
  artist_name: string;
  social: any;
  songs: any;
  style: Style;
}

export interface Style {
  width: string;
  height: string;
  colors: Colors;
}

export interface Colors {
  background: string;
  text: string;
  active_item: string;
  active_accent: string;
}

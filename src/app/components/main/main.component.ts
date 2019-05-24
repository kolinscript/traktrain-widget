import { Component, OnInit } from '@angular/core';
import { Colors, Style, Widget } from '../../models/widget.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  widget: Widget;
  playTrack = false;

  constructor() { }

  ngOnInit() {
    this.widget = this.createWidget();
    console.log(this.widget);
  }

  public play(): void {
    this.playTrack = !this.playTrack;
  }

  private createWidget(): Widget {
    const widget = {
      id_widget: 1,
      artist_name: 'Cutoffurmind',
      social: [{link: 'twitter.com', logo: 'twitter'}, {link: 'instagram.com', logo: 'instagram'}],
      songs: [
        'CUTOFFURMIND - BROKE AS HELL',
        'CUTOFFURMIND - CVE800',
        'CUTOFFURMIND - TRICK',
        'CUTOFFURMIND - LETS GET HIGH',
        'CUTOFFURMIND - WASSUP FOOL',
        'CUTOFFURMIND - UNDERBAR'
      ],
      style: {
        width: '980px',
        height: '720px',
        colors: {
          background: '#FFFFFF',
          text: '#4A4A4A',
          active_item: '#695FFC'
        } as Colors
      } as Style,
    } as Widget;
    return widget;
  }

}

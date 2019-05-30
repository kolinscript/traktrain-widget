import { Component, OnInit } from '@angular/core';
import { Colors, Style, Widget } from '../../../models/widget.model';
import { WidgetService } from '../../../services/widget.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {widget: Widget;
  playTrack = false;
  innerWidth: any;

  constructor(
    private widgetService: WidgetService
  ) { }

  ngOnInit() {
    this.widgetService.getWidget(13).subscribe((widget) => {
      console.log(widget);
    });
    this.widget = this.createWidget();
    this.innerWidth = window.innerWidth;
    console.log('innerWidth', this.innerWidth);
    console.log(this.widget);
  }

  public trackHover(event, track, i): void {
    console.log(event);
    console.log(track);
    console.log(i);
  }

  public trackPlay(): void {
    this.playTrack = !this.playTrack;
  }

  public onResize(event) {
    console.log(event.target.innerWidth);
  }

  private createWidget(): Widget {
    const widget = {
      id_widget: 1,
      artist_name: 'Cutoffurmind',
      social: [{link: 'twitter.com', logo: 'twitter'}, {link: 'instagram.com', logo: 'instagram'}],
      songs: [
        {title: 'CUTOFFURMIND - BROKE AS HELL', rights: 'MP3 Leasing', price: '$30.00', in_cart: true},
        {title: 'CUTOFFURMIND - CVE800', rights: 'MP3 Leasing', price: '$30.00', in_cart: false},
        {title: 'CUTOFFURMIND - TRICK', rights: 'MP3 Leasing', price: '$30.00', in_cart: false},
        {title: 'CUTOFFURMIND - LETS GET HIGH', rights: 'MP3 Leasing', price: '$30.00', in_cart: true},
        {title: 'CUTOFFURMIND - WASSUP FOOL', rights: 'MP3 Leasing', price: '$30.00', in_cart: false},
        {title: 'CUTOFFURMIND - UNDERBAR', rights: 'MP3 Leasing', price: '$30.00', in_cart: true},
      ],
      style: {
        width: '920px',
        height: '756px',
        colors: {
          background: '#FFFFFF',
          text: '#4A4A4A',
          active_item: '#695FFC',
          active_accent: '#524fc4'
        } as Colors
      } as Style,
    } as Widget;
    return widget;
  }

}


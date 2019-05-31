import { Component, OnInit } from '@angular/core';
import { Colors, LicensePriceMapper, Style, Widget } from '../../../models/widget.model';
import { WidgetService } from '../../../services/widget.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  widget: Widget;
  playTrack = false;
  innerWidth: any;

  constructor(
    private widgetService: WidgetService
  ) { }

  ngOnInit() {
    this.initWidget(() => {
      console.log(this.widget);
    });

    this.innerWidth = window.innerWidth;
    console.log('innerWidth', this.innerWidth);
  }

  public rcPrev() {}

  public rcNext() {}

  public trackHover(event, track, i): void {
    console.log(event);
    console.log(track);
    console.log(i);
  }

  public trackPlay(): void {
    this.playTrack = !this.playTrack;
  }

  public onResize(event): void {
    console.log(event.target.innerWidth);
  }

  private initWidget(completed): void {
    this.widgetService.getWidget(13).subscribe((widget: Widget) => {
      if (widget) {
        widget.tracks.forEach((track) => {
          track.sliderData = Object.keys(track.prices).map((price) => LicensePriceMapper[price]);
          // track.prices = {
          //   ...track.prices,
          //   labels: [Object.keys(track.prices).map((price) => LicensePriceMapper[price])]
          // };
        });
        this.widget = {
          ...widget,
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
        };
        completed();
       }
    });
  }

}


import { Component, OnInit } from '@angular/core';
import { Colors, LicensePriceMapper, Style, Track, Widget, SDN_LINK_IMG, SDN_LINK_MP3 } from '../../../models/widget.model';
import { WidgetService } from '../../../services/widget.service';
import { ModalService } from '../../../services/modal.service';
import { Modal, ModalContent, ModalTypes } from '../../../models/modal.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  SDN_LINK_IMG = SDN_LINK_IMG;
  SDN_LINK_MP3 = SDN_LINK_MP3;
  widget: Widget;
  modalOpen = false;
  modalContent: ModalContent;
  // modals: Modal[] = [];

  constructor(
    private widgetService: WidgetService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.widgetInit(() => {
      console.log(this.widget);
    });
    console.log('innerWidth', window.innerWidth);
  }

  // todo highlight to components/shared folder
  // Carousel : start
  private carouselInit(startIndex: number, trackId: number): void {
    const carouselLength = this.widget.tracks[trackId].sliderData.length;
    this.widget.tracks[trackId].sliderData.forEach(slide => (slide.style = ''));
    // console.log('carouselLength ', carouselLength);
    // console.log('Carousel start index ', startIndex);
    if (carouselLength > 3) {
      this.widget.tracks[trackId].sliderData[carouselLength - 1].style = 'prev';
      this.widget.tracks[trackId].sliderData[0].style = 'initial';
      this.widget.tracks[trackId].sliderData[1].style = 'next';
    } else if (carouselLength === 2) {
      this.widget.tracks[trackId].sliderData[0].style = 'initial';
      this.widget.tracks[trackId].sliderData[1].style = 'next';
    } else if (carouselLength === 1) {
      this.widget.tracks[trackId].sliderData[0].style = 'initial';
    }
    setInterval(() => {
      this.carouselSlide(this.widget.tracks[trackId], trackId, 'next');
    }, 3000);
  }

  public carouselSlide(track: Track, trackId: number, direction: string): void {
    const carouselLength = track.sliderData.length;
    const activeIndex = track.sliderData.findIndex(el => el.style === 'initial');
    // console.log('track ', track);
    // console.log('sliderDataLength ', sliderDataLength);
    // console.log('activeIndex ', activeIndex);
    switch (direction) {
      case 'prev': {
        if (carouselLength === 2) {
          if (activeIndex === 1) {
            track.sliderData[0].style =  'initial';
            track.sliderData[1].style =  'next';
          } else if (activeIndex === 0) {
            track.sliderData[0].style =  'next';
            track.sliderData[1].style =  'initial';
          }
        } else if (activeIndex === 0) {
          // console.log('activeIndex ', activeIndex);
          track.sliderData[activeIndex].style =  'next';
          track.sliderData[activeIndex + 1].style =  '';
          track.sliderData[carouselLength - 1].style =  'initial';
          track.sliderData[carouselLength - 2].style =  'prev';
        } else if (activeIndex === carouselLength - 1) {
          track.sliderData[activeIndex - 2].style =  'prev';
          track.sliderData[activeIndex - 1].style =  'initial';
          track.sliderData[activeIndex].style =  'next';
          track.sliderData[0].style =  '';
        } else if (activeIndex === 1) {
          track.sliderData[carouselLength - 1].style =  'prev';
          track.sliderData[0].style =  'initial';
          track.sliderData[1].style =  'next';
          track.sliderData[2].style =  '';
        } else if (activeIndex !== 0) {
          // console.log('activeIndex ', activeIndex);
          track.sliderData[activeIndex - 2].style =  'prev';
          track.sliderData[activeIndex - 1].style =  'initial';
          track.sliderData[activeIndex].style =  'next';
          track.sliderData[activeIndex + 1].style =  '';
        }
        break;
      }
      case 'next': {
        if (carouselLength === 1) {
          track.sliderData[0].style =  'initial';
        } else if (carouselLength === 2) {
          if (activeIndex === 1) {
            track.sliderData[0].style =  'initial';
            track.sliderData[1].style =  'next';
          } else if (activeIndex === 0) {
            track.sliderData[0].style =  'next';
            track.sliderData[1].style =  'initial';
          }
        } else if (activeIndex === 0) {
          // console.log('activeIndex ', activeIndex);
          track.sliderData[activeIndex].style =  'prev';
          track.sliderData[activeIndex + 1].style =  'initial';
          track.sliderData[activeIndex + 2].style =  'next';
          track.sliderData[carouselLength - 1].style =  '';
        } else if (activeIndex === carouselLength - 1) {
          track.sliderData[activeIndex - 1].style =  '';
          track.sliderData[activeIndex].style =  'prev';
          track.sliderData[0].style =  'initial';
          track.sliderData[1].style =  'next';
        } else if (activeIndex === carouselLength - 2) {
          track.sliderData[activeIndex - 1].style =  '';
          track.sliderData[activeIndex].style =  'prev';
          track.sliderData[activeIndex + 1].style =  'initial';
          track.sliderData[0].style =  'next';
        } else if (activeIndex !== 0) {
          // console.log('activeIndex ', activeIndex);
          track.sliderData[activeIndex - 1].style =  '';
          track.sliderData[activeIndex].style =  'prev';
          track.sliderData[activeIndex + 1].style =  'initial';
          track.sliderData[activeIndex + 2].style =  'next';
        }
        break;
      }
    }
    this.widget.tracks[trackId].sliderData = track.sliderData;
  }
  // Carousel : end

  public trackHover(event, track, trackId): void {
    this.widget.tracks[trackId].hovered = true;
  }

  public trackLeave(event, track, trackId): void {
    this.widget.tracks[trackId].hovered = false;
  }

  public trackPlay(event, track, trackId): void {
    this.widget.tracks.forEach((tr) => tr.play = false);
    this.widget.tracks.forEach((tr) => tr.active = false);
    this.widget.tracks[trackId].play = true;
    this.widget.tracks[trackId].active = true;
    this.carouselInit(this.widget.tracks[trackId].sliderIndex, trackId);
  }

  public trackAddToCart(event, track, trackId): void {
    this.modalOpen = true;
    this.modalContent = {
      title: 'BUY TERMS',
      type: ModalTypes.TERMS,
      contentTerms: {
        paymentInfo: this.widget.producer.paymentInfo,
        sliderData: track.sliderData,
        rightsDescription: this.createRightsDescriptions(track.sliderData)
      }
    };
    this.modalContent.contentTerms.sliderData[0].activeInModal = true;
    this.modalContent.contentTerms.rightsDescription[0].activeInModal = true;
  }

  public modalEvent($event) {
    console.log($event);
    this.modalOpen = false;
  }

  public onResize(event): void {
    console.log(event.target.innerWidth);
  }

  private widgetInit(completed): void {
    this.widgetService.getWidget(13).subscribe((widget: Widget) => {
      if (widget) {
        widget.tracks.forEach((track) => {
          track.sliderData = this.priceTransformer(track.prices);
          track.sliderIndex = 0;
          track.active = false;
          track.hovered = false;
          track.play = false;
          track.inCart = false;
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
              active_accent: '#524fc4',
            } as Colors,
          } as Style,
        };
        completed();
       }
    });
  }

  private priceTransformer(INPUT_PRICES: {}): {}[] {
    const OUTPUT_ARRAY = [];
    for (const key in INPUT_PRICES) {
      if (INPUT_PRICES.hasOwnProperty(key)) {
        OUTPUT_ARRAY.push({
          style: '',
          right: LicensePriceMapper[key],
          price: INPUT_PRICES[key],
          activeInModal: false
        });
      }
    }
    return OUTPUT_ARRAY;
  }

  private createRightsDescriptions(array: object[]): string[] {
    const rdArray = [];
    array.forEach((item) => {
      console.log(Object.values(item));
      switch (Object.values(item)[1]) {
        case 'MP3 Leasing': {
          rdArray.push({
            label: 'MP3 Leasing rights',
            rights: Object.values(this.widget.producer.mp3Leasing),
            activeInModal: false
          });
          break;
        }
        case 'Wav Leasing': {
          rdArray.push({
            label: 'Wav Leasing rights',
            rights: Object.values(this.widget.producer.wavLeasing),
            activeInModal: false
          });
          break;
        }
        case 'Wav Trackout': {
          rdArray.push({
            label: 'Wav Trackout rights',
            rights: Object.values(this.widget.producer.wavTrackout),
            activeInModal: false
          });
          break;
        }
        case 'Unlimited': {
          rdArray.push({
            label: 'Unlimited rights',
            rights: Object.values(this.widget.producer.unlimited),
            activeInModal: false
          });
          break;
        }
        case 'Exclusive': {
          rdArray.push({
            label: 'Exclusive rights',
            rights: Object.values(this.widget.producer.exclusive),
            activeInModal: false
          });
          break;
        }
      }
    });
    return rdArray;
  }

}


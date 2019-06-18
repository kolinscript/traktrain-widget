import { Component, ElementRef, OnInit } from '@angular/core';
import { Colors, LicensePriceMapper, Style, Track, Widget, SDN_LINK_IMG, SDN_LINK_MP3 } from '../../../models/widget.model';
import { WidgetService } from '../../../services/widget.service';
import { ModalService } from '../../../services/modal.service';
import { Modal, ModalContent, ModalTypes } from '../../../models/modal.model';
import { Howl } from 'howler';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  SDN_LINK_IMG = SDN_LINK_IMG;
  SDN_LINK_MP3 = SDN_LINK_MP3;
  windowWidth: number;
  widget: Widget;
  modalOpen = false;
  modalContent: ModalContent;
  // modals: Modal[] = [];
  playerActiveTrackIndex = 0;
  playerPlay = false;
  playerProgressSec: number | any;
  playerProgressMS = '00:00';
  playerDurationMS = '00:00';
  playerProgressPercent: number;
  playerProgressInterval: any;
  playerHowl: Howl;
  playerTrackName: string;
  playerTracklbImage: string;
  //
  cart: number[] = []; // track id's array

  constructor(
    private widgetService: WidgetService,
    private modalService: ModalService,
    public elRef: ElementRef
  ) { }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    console.log('windowWidth', this.windowWidth);
    this.widgetInit(() => {
      console.log(this.widget);
      this.playerHowlInit(this.playerActiveTrackIndex);
      this.carouselInit(this.widget.tracks[this.playerActiveTrackIndex].sliderIndex, this.playerActiveTrackIndex);
    });
  }

  // todo highlight to components/shared folder
  // Carousel : start
  private carouselInit(startIndex: number, trackIndex: number): void {
    const carouselLength = this.widget.tracks[trackIndex].sliderData.length;
    this.widget.tracks[trackIndex].sliderData.forEach(slide => (slide.style = ''));
    // console.log('carouselLength ', carouselLength);
    // console.log('Carousel start index ', startIndex);
    if (carouselLength > 3) {
      this.widget.tracks[trackIndex].sliderData[carouselLength - 1].style = 'prev';
      this.widget.tracks[trackIndex].sliderData[0].style = 'initial';
      this.widget.tracks[trackIndex].sliderData[1].style = 'next';
    } else if (carouselLength === 2) {
      this.widget.tracks[trackIndex].sliderData[0].style = 'initial';
      this.widget.tracks[trackIndex].sliderData[1].style = 'next';
    } else if (carouselLength === 1) {
      this.widget.tracks[trackIndex].sliderData[0].style = 'initial';
    }
    setInterval(() => {
      this.carouselSlide(this.widget.tracks[trackIndex], trackIndex, 'next');
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

  public trackHover(event, track, trackIndex): void {
    this.widget.tracks[trackIndex].hovered = true;
  }

  public trackLeave(event, track, trackIndex): void {
    this.widget.tracks[trackIndex].hovered = false;
  }

  public trackProgressClicked($event) {
    console.log($event);
    console.log($event.offsetX);
    const playerProgressPx = $event.offsetX;
    this.playerProgressPercent = ((playerProgressPx * 100) / this.windowWidth);
    this.playerProgressSec = ((this.playerHowl.duration() * this.playerProgressPercent) / 100);
    if (this.playerProgressSec) {
      this.playerHowl.seek(this.playerProgressSec);
    }
  }

  // public trackChoose(event, track, trackIndex): void {
  //   console.log(trackIndex);
  //   this.widget.tracks.forEach((tr) => tr.active = false);
  //   this.widget.tracks[trackIndex].active = true;
  //   this.playerActiveTrackIndex = trackIndex;
  //   this.carouselInit(this.widget.tracks[trackIndex].sliderIndex, trackIndex);
  // }

  public trackPlay(event?, track?, trackIndex?): void {
    if (trackIndex || trackIndex === 0) { this.playerActiveTrackIndex = trackIndex; } // обновление активного трека (если клик по листу)
    this.carouselInit(this.widget.tracks[this.playerActiveTrackIndex].sliderIndex, this.playerActiveTrackIndex);
    this.playerTrackName = this.widget.tracks[this.playerActiveTrackIndex].name;
    this.playerTracklbImage = this.widget.tracks[this.playerActiveTrackIndex].lbImage;
    //
    if (this.widget.tracks[this.playerActiveTrackIndex].active === true) { // выбранный трек активный? - да
      if (this.widget.tracks[this.playerActiveTrackIndex].play === true) { // выбранный трек играет? - да
        this.playerHowl.pause();                              // пауза ховлера
        this.playerPlay = false;
        this.widget.tracks[this.playerActiveTrackIndex].play = false;
        if (this.playerProgressInterval) {
          clearInterval(this.playerProgressInterval);         // чистка таймера
        }
      } else {                                            // выбранный трек играет? - нет
        if (this.playerProgressSec) {                     // выбранный трек играл раньше? - да
          this.playerHowl.seek(this.playerProgressSec);       // устанавливаем время запуска трека (текущее на момент установкии паузы)
          this.playerHowl.play();                             // запускаем плеер
          this.playerPlay = true;
          this.widget.tracks[this.playerActiveTrackIndex].play = true;
        } else {                                          // выбранный трек играл раньше? - нет
          this.playerHowlInit(this.playerActiveTrackIndex);   // инициализируем ховлер
          this.playerHowl.play();                             // запускаем плеер
          this.playerPlay = true;
          this.widget.tracks[this.playerActiveTrackIndex].play = true;
        }
      }
    } else {                                              // выбранный трек активный? - нет
      this.playerProgressSec = 0;
      this.playerProgressPercent = 0;
      this.playerProgressMS = '00:00';
      this.playerDurationMS = '00:00';
      if (this.playerHowl) {
        if (this.playerProgressInterval) {
          clearInterval(this.playerProgressInterval);         // чистка таймера
        }
        this.playerHowl.stop();
        this.playerPlay = false;
      }
      this.widget.tracks.forEach((tr) => tr.play = false);
      this.widget.tracks.forEach((tr) => tr.active = false);
      this.playerHowlInit(this.playerActiveTrackIndex);                    // инициализируем инстанс ховлера
      this.playerHowl.play();
      this.playerPlay = true;
      this.widget.tracks[this.playerActiveTrackIndex].active = true;
      this.widget.tracks[this.playerActiveTrackIndex].play = true;
      setTimeout(() => {
        this.elRef.nativeElement.querySelector('.active ').focus();
        this.elRef.nativeElement.querySelector('.active').scrollIntoView({behavior: 'smooth'});
      }, 100);
    }
  }

  public trackToggle(direction: string): void {
    const tracksLength = this.widget.tracks.length;
    direction === 'prev' ?
      this.playerActiveTrackIndex > 0
      ? this.trackPlay(null, null, this.playerActiveTrackIndex - 1)
      : this.trackPlay(null, null, tracksLength - 1)
      : this.playerActiveTrackIndex === tracksLength - 1
      ? this.trackPlay(null, null, 0)
      : this.trackPlay(null, null, this.playerActiveTrackIndex + 1);
  }

  private playerHowlInit(trackIndex: number): void {
    this.playerHowl = new Howl({
      src: [SDN_LINK_MP3 + this.widget.tracks[trackIndex].link],
      html5: true,
      onload: () => {
        this.playerDurationMS = new Date(Math.round(this.playerHowl.duration()) * 1000).toISOString().substr(14, 5);
      },
      onplay: () => {
        this.playerProgressInterval = setInterval(() => {
          this.playerProgressSec
            = (typeof this.playerHowl.seek() === 'number')
            ? Math.round(+this.playerHowl.seek())
            : this.playerHowl.seek();
          this.playerProgressPercent = ((this.playerProgressSec * 100) / this.playerHowl.duration());
          this.playerProgressMS = new Date(this.playerProgressSec * 1000).toISOString().substr(14, 5);
        }, 1000);

      },
      onseek: () => {
        this.playerProgressSec
          = (typeof this.playerHowl.seek() === 'number')
          ? Math.round(+this.playerHowl.seek())
          : this.playerHowl.seek();
        this.playerProgressMS = new Date(this.playerProgressSec * 1000).toISOString().substr(14, 5);
      },
      onpause: () => {},
      onend: () => {
        clearInterval(this.playerProgressInterval);
        this.playerProgressSec = 0;
        this.playerProgressPercent = 0;
        this.playerProgressMS = '00:00';
        this.playerDurationMS = '00:00';
        this.playerPlay = false;
        this.widget.tracks[trackIndex].play = false;
        this.trackToggle('next');
      },
    });
  }

  public trackAddToCart(event, track, trackId): void {
    this.modalOpen = true;
    this.modalContent = {
      title: 'BUY TERMS',
      type: ModalTypes.TERMS,
      contentTerms: {
        track: {...track},
        paymentInfo: this.widget.producer.paymentInfo,
        sliderData: track.sliderData,
        rightsDescription: this.createRightsDescriptions(track.sliderData)
      }
    };
    this.modalContent.contentTerms.sliderData[0].activeInModal = true;
    this.modalContent.contentTerms.rightsDescription[0].activeInModal = true;
  }

  public modalEvent(event) {
    this.modalOpen = false;
    switch (event.type) {
      case 'close': {
        console.log('close no result');
        break;
      }
      case 'addToCart' : {
        console.log(event);
      }
    }
  }

  public onResize(event): void {
    this.windowWidth = event.target.innerWidth;
    console.log(this.windowWidth);
  }

  private widgetInit(completed): void {
    this.widgetService.getWidget(13).subscribe((widget: Widget) => {
      if (widget) {
        widget.tracks.forEach((track) => {
          track.sliderData = this.priceTransformer(track.prices); // set default current track's sliderData array based on track's prices
          track.sliderIndex = 0;  // set default index of active slide in current track slider's
          track.active = false;   // set default current track's status on trackChoose()
          track.hovered = false;  // set default current track's hovered event status
          track.play = false;     // set default current track's play status
          track.inCart = false;   // set default current track's inCart status
          track.tagsArr = track.tags.split('/');
        });
        //
        widget.tracks[this.playerActiveTrackIndex].active = true;
        this.playerTrackName = widget.tracks[this.playerActiveTrackIndex].name;
        this.playerTracklbImage = widget.tracks[this.playerActiveTrackIndex].lbImage;
        //
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
          } as Style, // add default Widget styles
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


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Colors, LicensePriceMapper, Style, Track, Widget, SDN_LINK_IMG, SDN_LINK_MP3, CartItem, Cart } from '../../../models/widget.model';
import { WidgetService } from '../../../services/widget.service';
import { ModalService } from '../../../services/modal.service';
import { ModalContent, ModalTypes } from '../../../models/modal.model';
import { SettingsContent } from '../../../models/settings.model';
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @ViewChild('waves') canvasWavesElRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('volumeDesktop') volumeContainerDesktop: ElementRef;
  @ViewChild('volumeMobile') volumeContainerMobile: ElementRef;
  SDN_LINK_IMG = SDN_LINK_IMG;
  SDN_LINK_MP3 = SDN_LINK_MP3;
  widget: Widget;
  loadingWidget: boolean;
  windowWidth: number;
  breakPoint = 600;
  modalOpen = false;
  modalContent: ModalContent;
  settingsContent: SettingsContent;
  carouselMoving: boolean;
  //
  playerActiveTrackIndex = 0;
  playerPlay = false;
  playerProgressSec: number | any;
  playerProgressMS = '00:00';
  playerDurationMS = '00:00';
  playerProgressPercent: number;
  playerProgressDragged = false;
  playerProgressInterval: any;
  playerVolumePercent: number;
  playerVolumeDragged = false;
  playerHowl: Howl;
  playerTrackName: string;
  playerTrackTags: string[];
  playerTracklbImage: string;
  //
  filterBy: FormGroup;
  tracksBuffer: Track[];
  searchFocused = false;
  //
  analyser: any;
  freqArray: any;
  ctx: any;
  lines = [];
  screenWidth: number;
  screenHeight: number;

  private ctxCanvas: CanvasRenderingContext2D;

  constructor(
    private widgetService: WidgetService,
    private modalService: ModalService,
    private fb: FormBuilder,
    public elRef: ElementRef
  ) { }

  ngOnInit() {
    this.initFilters();
    this.initWidget(() => {
      // console.log(this.widget);
      // console.log(this.widget.tracks.map(t => (t.drumKit)));
      this.initPlayerHowl(this.playerActiveTrackIndex);
      this.initCarousel(this.widget.tracks[this.playerActiveTrackIndex].sliderIndex, this.playerActiveTrackIndex);
    }, 9); // widgets id's: 2, 3, 5, 9(SESH) 13, 13319
  }

  // todo highlight to components/shared folder
  // Carousel : start
  private initCarousel(startIndex: number, trackIndex: number): void {
    this.carouselMoving = false;
    const carouselLength = this.widget.tracks[trackIndex].sliderData.length;
    this.widget.tracks[trackIndex].sliderData.forEach(slide => (slide.style = ''));
    // console.log('carouselLength ', carouselLength);
    // console.log('Carousel start index ', startIndex);
    if (carouselLength >= 3) {
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
      if (this.widget.tracks && this.widget.tracks.length > 0) {
        this.carouselSlide(this.widget.tracks[trackIndex], trackIndex, 'next');
      }
    }, 3000);
  }

  public carouselSlide(track: Track, trackId: number, direction: string): void {
    // console.log(this.carouselMoving);
    if (!this.carouselMoving) {
      this.disableInteraction();
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
  }

  private disableInteraction() {
    this.carouselMoving = true;
    setTimeout(() => {
      this.carouselMoving = false;
    }, 500);
  }
  // Carousel : end

  public trackHover(event, track: Track, trackIndex: number): void {
    this.widget.tracks[trackIndex].hovered = true;
  }

  public trackLeave(event, track: Track, trackIndex: number): void {
    this.widget.tracks[trackIndex].hovered = false;
  }

  public searchFocus(direction: string): void {
    switch (direction) {
      case 'in' : {
        this.searchFocused = true;
        break;
      }
      case 'out' : {
        this.searchFocused = ((this.filterBy.value.filterByTrackName !== null) && (this.filterBy.value.filterByTrackName.trim() !== ''));
        if (this.filterBy.value.filterByTrackName !== null) {
          this.filterBy.controls['filterByTrackName'].setValue(this.filterBy.value.filterByTrackName.trim());
        }
        break;
      }
    }
  }

  public searchTrack(): void {
    this.widget.tracks = this.tracksBuffer;
    let filtered = this.tracksBuffer;
    if (this.filterBy.value.filterByTrackName.trim() !== null) {
      filtered = filtered.filter((track: Track) => {
        return track.name.toLocaleLowerCase().includes(this.filterBy.value.filterByTrackName.trim().toLocaleLowerCase());
      });
    }
    this.widget.tracks = filtered;
    //
    if (filtered.length > 0) {
      this.playerActiveTrackIndex = 0;
      this.widget.tracks.forEach((tr) => tr.active = false);
      this.widget.tracks.forEach((tr) => tr.play = false);
      // this.widget.tracks[this.playerActiveTrackIndex].active = true;
    }
  }

  public searchClear(): void {
    this.filterBy.controls['filterByTrackName'].setValue(null);
    this.widget.tracks = this.tracksBuffer;
    this.searchFocused = false;
    //
    this.playerActiveTrackIndex = 0; // todo ACTIVE INDEX SHOULD PASSED TO PREVIOUS ACTIVE TRACK
    this.widget.tracks.forEach((tr) => tr.active = false);
    this.widget.tracks.forEach((tr) => tr.play = false);
    // this.widget.tracks[this.playerActiveTrackIndex].active = true;
  }

  public trackVolumeClick(event): void {
    switch (event.type) {
      case ('mousedown'): {
        this.playerVolumeDragged = true;
        this.playerVolumePercent = (
          (event.offsetX * 100) /
          (this.volumeContainerDesktop.nativeElement.offsetWidth || this.volumeContainerMobile.nativeElement.offsetWidth)
        );
        const volume = +(Math.round((this.playerVolumePercent / 100 * 10)) / 10).toFixed(1);
        this.playerHowl.volume(volume);
        break;
      }
      case ('mousemove'): {
        if (this.playerVolumeDragged) {
          this.playerVolumePercent = (
            (event.offsetX * 100) /
            (this.volumeContainerDesktop.nativeElement.offsetWidth || this.volumeContainerMobile.nativeElement.offsetWidth)
          );
          const volume = +(Math.round((this.playerVolumePercent / 100 * 10)) / 10).toFixed(1);
          this.playerHowl.volume(volume);
        }
        break;
      }
      case ('mouseup'): {
        this.playerVolumeDragged = false;
        break;
      }
    }
  }

  public trackProgressClicked(event): void {
    switch (event.type) {
      case ('mousedown'): {
        this.playerProgressDragged = true;
        this.playerProgressPercent = (event.offsetX * 100) / this.windowWidth;
        this.playerProgressSec = (this.playerHowl.duration() * this.playerProgressPercent) / 100;
        if (this.playerProgressSec) {
          this.playerHowl.seek(this.playerProgressSec);
        }
        break;
      }
      case ('mousemove'): {
        if (this.playerProgressDragged) {
          if (!this.playerHowl.playing()) {
            this.playerProgressPercent = (event.offsetX * 100) / this.windowWidth;
            this.playerProgressSec = (this.playerHowl.duration() * this.playerProgressPercent) / 100;
          }
        }
        break;
      }
      case ('mouseup'): {
        this.playerProgressDragged = false;
        break;
      }
    }
  }

  public trackPlay(event?, track?: Track, trackIndex?: number): void {
    // console.log(this.widget.tracks.length);
    if (this.widget.tracks.length > 0) {
      if (trackIndex || trackIndex === 0) { this.playerActiveTrackIndex = trackIndex; } // обновление активного трека (если клик по листу)
      this.initCarousel(this.widget.tracks[this.playerActiveTrackIndex].sliderIndex, this.playerActiveTrackIndex);
      this.playerTrackName = this.widget.tracks[this.playerActiveTrackIndex].name;
      this.playerTrackTags = this.widget.tracks[this.playerActiveTrackIndex].tagsArr;
      this.playerTracklbImage =
        this.widget.tracks[this.playerActiveTrackIndex].image
        || this.widget.tracks[this.playerActiveTrackIndex].lbImage;
      //
      if (this.widget.tracks[this.playerActiveTrackIndex].active === true) { // выбранный трек активный? - да
        if (this.widget.tracks[this.playerActiveTrackIndex].play === true) { // выбранный трек играет? - да
          this.playerHowl.pause();                              // пауза ховлера
          this.playerPlay = false;
          this.widget.tracks[this.playerActiveTrackIndex].play = false;
          if (this.analyser && this.analyser.ctx) {
            this.analyser.ctx.close();
          }
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
            this.initPlayerHowl(this.playerActiveTrackIndex);   // инициализируем ховлер
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
        this.initPlayerHowl(this.playerActiveTrackIndex);                    // инициализируем инстанс ховлера
        this.playerHowl.play();
        this.playerPlay = true;
        this.widget.tracks[this.playerActiveTrackIndex].active = true;
        this.widget.tracks[this.playerActiveTrackIndex].play = true;
        setTimeout(() => {
          this.elRef.nativeElement.querySelector('.active ').focus();
          this.elRef.nativeElement.querySelector('.active').scrollIntoView({behavior: 'smooth'});
        }, 100);
      }
    } else {
      if (this.playerHowl) {
        if (!this.playerPlay) {
          this.playerPlay = true;
          this.playerHowl.play();
        } else {
          this.playerHowl.pause();
          this.playerPlay = false;
          if (this.playerProgressInterval) {
            clearInterval(this.playerProgressInterval);
          }
        }
      }
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

  private initPlayerHowl(trackIndex: number): void {
    this.playerPlay = false;
    this.playerProgressSec = 0;
    this.playerProgressPercent = 0;
    this.playerProgressMS = '00:00';
    this.playerDurationMS = '00:00';
    this.playerHowl = new Howl({
      src: [SDN_LINK_MP3 + this.widget.tracks[trackIndex].link],
      onload: () => {
        this.playerDurationMS = new Date(Math.round(this.playerHowl.duration()) * 1000).toISOString().substr(14, 5);
        // equalizer
        this.ctx = Howler.ctx;
        this.analyser = this.ctx.createAnalyser();
        const bufferLength = this.analyser.frequencyBinCount;
        this.analyser.fftSize = 256;
        this.freqArray = new Uint8Array(bufferLength);
        Howler.masterGain.connect(this.analyser);
        // console.log(this.analyser);
        // console.log(this.freqArray);
      },
      onplay: () => {
        this.initEqualizerScreen();
        this.animateEqualizer();
        this.playerProgressInterval = setInterval(() => {
          this.playerProgressSec
            = (typeof this.playerHowl.seek() === 'number')
            ? Math.round(+this.playerHowl.seek())
            : this.playerHowl.seek();
          this.playerProgressPercent = ((this.playerProgressSec * 100) / this.playerHowl.duration());
          this.playerProgressMS = new Date(this.playerProgressSec * 1000).toISOString().substr(14, 5);
          this.animateEqualizer();
        }, 100);
      },
      onseek: () => {
        this.playerProgressSec
          = (typeof this.playerHowl.seek() === 'number')
          ? Math.round(+this.playerHowl.seek())
          : this.playerHowl.seek();
        this.playerProgressMS = new Date(this.playerProgressSec * 1000).toISOString().substr(14, 5);
      },
      onpause: () => {
        this.lines.forEach((line) => {
          line.style.height = 0 + 'px';
        });
      },
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
    this.playerHowl.load();
  }

  public trackAddToCart(event, track: Track, trackIndex: number): void {
    track.hovered = false;
    this.modalOpen = true;
    this.modalContent = {
      style: this.widget.style,
      title: 'BUY TERMS',
      type: ModalTypes.TERMS,
      artistName: this.widget.producer.artistName,
      contentTerms: {
        track: {...track},
        trackIndex: trackIndex,
        paymentInfo: this.widget.producer.paymentInfo,
        sliderData: track.sliderData,
        rightsDescription: this.createRightsDescriptions(track.sliderData),
      },
    };
  }

  public cartOpen(): void {
    console.log(this.widget.cart);
    this.modalOpen = true;
    this.modalContent = {
      style: this.widget.style,
      title: 'CART',
      type: ModalTypes.CART,
      artistName: this.widget.producer.artistName,
      cart: this.widget.cart,
    };
  }

  public modalEvent(event): void {
    this.modalOpen = false;
    switch (event.type) {
      case 'close': {
        console.log('close no result');
        break;
      }
      case 'addToCart' : {
        console.log(event);
        this.widget.tracks[event.trackIndex] = event.cartItem.track;
        this.widget.cart = {
          ...this.widget.cart,
          totalCost: this.widget.cart.totalCost + event.cartItem.price,
        };
        this.widget.cart.cartItems.push(event.cartItem);
      }
    }
    console.log(this.widget);
    console.log(this.widget.cart);
    this.storageUpdate('cart', this.widget.cart);
  }

  public settingsEvent(event): void {
    console.log(event);
    if (event['active']) {
      this.widget.style.colors.active_item = event['active'];
    }
    if (event['accent']) {
      this.widget.style.colors.active_accent = event['accent'];
    }
  }

  public onResize(event): void {
    this.windowWidth = event.target.innerWidth;
    this.screenWidth = (document.getElementsByClassName('wi-screen') as HTMLCollection)[0].clientWidth;
    this.screenHeight = (document.getElementsByClassName('wi-screen') as HTMLCollection)[0].clientHeight;
    console.log('windowWidth', this.windowWidth);
    console.log('screenWidth', this.screenWidth);
    console.log('screenHeight', this.screenHeight);
  }

  private initWidget(completed, id: number): void {
    this.windowWidth = window.innerWidth;
    this.loadingWidget = true;
    const cart = this.storageFetch('cart') as Cart;
    console.log('windowWidth', this.windowWidth);
    console.log('cart', cart);
    this.widgetService.getWidget(id).subscribe((widget: Widget) => {
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
        this.playerTrackTags = widget.tracks[this.playerActiveTrackIndex].tagsArr;
        this.playerTracklbImage = widget.tracks[this.playerActiveTrackIndex].lbImage;
        //
        this.widget = {
          ...widget,
          style: {
            width: '920px', // deprecated
            height: '756px', // deprecated
            colors: {
              background: '#FFFFFF',
              text: '#4A4A4A',
              active_item: '#fc6782',
              active_accent: '#c4315e',
            } as Colors,
          } as Style,        // add default Widget styles
          cart: cart ? cart : {
            totalCost: 0,
            cartItems: [],
          } as Cart,        // setup empty cart
          editMode: true,
        } as Widget;
        if (cart) {
          this.widget.tracks.map((track: Track, trackIndex: number) => {
            this.widget.cart.cartItems.forEach((cartItem: CartItem) => {
              cartItem.track.active = false;
              cartItem.track.hovered = false;
              if (track.id === cartItem.track.id) {
                this.widget.tracks[trackIndex] = cartItem.track;
              }
            });
          });
        }
        if (this.widget.editMode) {
          this.settingsContent = {
            widgetID: id,
          };
        }
        this.tracksBuffer = this.widget.tracks;
        this.loadingWidget = false;
        completed();
       }
    });
  }

  private initFilters() {
    this.filterBy = this.fb.group({
      filterByTrackName: null,
    });
  }

  private initEqualizerScreen() {
    this.ctxCanvas = this.canvasWavesElRef.nativeElement.getContext('2d');
    this.screenWidth = (document.getElementsByClassName('wi-screen') as HTMLCollection)[0].clientWidth;
    this.screenHeight = (document.getElementsByClassName('wi-screen') as HTMLCollection)[0].clientHeight;
    this.ctxCanvas.fillRect(0, 0,  this.screenWidth, this.screenHeight);
    console.log('Equalizer screen initialized');
  }

  private animateEqualizer() {
    if (this && this.analyser) {
      this.analyser.getByteFrequencyData(this.freqArray);
      // this.lines.forEach((line, i) => {
      //   line.style.height = this.freqArray[i] / 2 + 'px';
      // });
      let xPos = 0;

      const lineAmount = 68;
      const space = 2;

      this.ctxCanvas.clearRect(0, 0, this.screenWidth, this.screenHeight);
      for (let i = 0; i < lineAmount; i++) {
        // const line = document.createElement('div');
        // line.setAttribute('class', 'wave-line line_' + i);
        // line.style.left = (xPos + 0) + 'px';
        // line.style.width = width + 'px';
        // this.lines.push(line);
        // target.appendChild(line);

        const barWidth = Math.round(this.screenWidth / 256);
        const barHeight = Math.round(this.freqArray[i] / 2);
        console.log(Math.round(barWidth));
        console.log(Math.round(barHeight));

        this.ctxCanvas.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
        this.ctxCanvas.fillRect(xPos, 0, barWidth, barHeight);

        xPos += barWidth + space;
      }
    }
  }

  private storageUpdate(key: string, data: {}) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private storageFetch(key): {} {
    return JSON.parse(localStorage.getItem(key));
  }

  private priceTransformer(INPUT_PRICES: {}): {}[] {
    const OUTPUT_ARRAY = [];
    for (const key in INPUT_PRICES) {
      if (INPUT_PRICES.hasOwnProperty(key)) {
        OUTPUT_ARRAY.push({
          style: '',
          right: LicensePriceMapper[key],
          rightEnumVal: key,
          price: INPUT_PRICES[key],
          activeInModal: false,
          addedToCart: false
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


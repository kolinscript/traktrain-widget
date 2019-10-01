import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalContent, ModalTypes } from '../../../models/modal.model';
import { CartItem, CartPayPal, LicensePriceMapper, SDN_LINK_IMG } from '../../../models/widget.model';
import { Animations } from '../../../animations';
import { LightenDarkenColor } from '../../../helpers';
import { WidgetService } from '../../../services/widget.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    Animations.slideUpDown
  ]
})
export class ModalComponent implements OnInit {
  lightenDarkenColor = LightenDarkenColor;
  @Input() modalContent: ModalContent;
  @Output() modalResult: EventEmitter<any> = new EventEmitter<any>();
  ModalTypes = ModalTypes;
  // variables TERMS
  pickedLease: any;
  // variables CART
  SDN_LINK_IMG = SDN_LINK_IMG;
  LicensePriceMapper = LicensePriceMapper;
  formGroupPayPal: FormGroup;
  @ViewChild('formPayPal') formPayPal;

  constructor(
    private widgetService: WidgetService,
    private fb: FormBuilder
  ) { }

  /*
  * function common block
  */
  ngOnInit() {
    console.log(this.modalContent.style);
    switch (this.modalContent.type) {
      case ModalTypes.TERMS: {
        this.initTerms();
        break;
      }
      case ModalTypes.CART: {
        this.initCart();
        break;
      }
    }
    console.log(this.modalContent);
  }

  modalClose(): void {
    switch (this.modalContent.type) {
      case ModalTypes.TERMS: {
        this.modalContent.contentTerms.sliderData.forEach((button) => button.activeInModal = false);
        this.modalContent.contentTerms.rightsDescription.forEach((rights) => rights.activeInModal = false);
        break;
      }
      case ModalTypes.CART: {
        break;
      }
    }
    this.modalResult.emit({type: 'close'});
  }

  /*
  * function TERMS block
  */
  private initTerms() {
    console.log(this.modalContent);
    this.modalContent.contentTerms.sliderData[0].activeInModal = true;
    this.modalContent.contentTerms.rightsDescription[0].activeInModal = true;
    this.pickedLease = this.modalContent.contentTerms.sliderData[0];
  }

  public pickLease(right: any, i: number): void {
    console.log(right);
    console.log(i);
    this.pickedLease = right;
    this.modalContent.contentTerms.sliderData.forEach((button) => button.activeInModal = false);
    this.modalContent.contentTerms.rightsDescription.forEach((rights) => rights.activeInModal = false);
    this.modalContent.contentTerms.sliderData[i].activeInModal = true;
    this.modalContent.contentTerms.rightsDescription[i].activeInModal = true;
  }

  public addToCart() {
    console.log(this.modalContent.contentTerms.sliderData);
    this.modalContent.contentTerms.sliderData.map((sliderDataItem) => {
      sliderDataItem.addedToCart = sliderDataItem.activeInModal ? true : sliderDataItem.addedToCart;
    });
    this.modalResult.emit({
      type: 'addToCart',
      cartItem: {
        price: this.pickedLease.price,
        track: {
          ...this.modalContent.contentTerms.track,
          inCart: true,
        },
        cartItemServer: {
          trackId: this.modalContent.contentTerms.track.id,
          right: this.pickedLease.rightEnumVal,
        },
      } as CartItem,
      trackIndex: this.modalContent.contentTerms.trackIndex,
    });
    this.modalContent.contentTerms.sliderData.forEach((button) => button.activeInModal = false);
    this.modalContent.contentTerms.rightsDescription.forEach((rights) => rights.activeInModal = false);
  }

  /*
  * function CART block
  */
  private initCart() {
    this.modalContent.cart.cartItems.forEach(item => item.track.play = false);
    this.formGroupPayPal = this.fb.group({
      expType: 'light',
      paykey: null
    });
  }

  public deleteTrackFromCart(indexTrack: number) {
    this.modalContent.cart.totalCost = this.modalContent.cart.totalCost - this.modalContent.cart.cartItems[indexTrack].price;
    this.modalContent.cart.cartItems[indexTrack].track.inCart = false;
    this.modalContent.cart.cartItems[indexTrack].track.hovered = false;
    this.modalContent.cart.cartItems.splice(indexTrack, 1);
  }

  public checkOutWithPayPal() {
    const cart = {
      cart: []
    };
    this.modalContent.cart.cartItems.forEach((item) => {
      cart.cart.push(item.cartItemServer);
    });
    console.log(cart);
    this.widgetService.sendCartToPayPal(cart).subscribe((res) => {
      if (res) {
        this.formGroupPayPal.get('paykey').setValue(res);
        console.log(this.formGroupPayPal.value);
        if (this.formGroupPayPal.valid) {
          this.submitPayPal();
        }
      }
    });
  }

  public submitPayPal() {
    this.formPayPal.nativeElement.submit();
  }

}

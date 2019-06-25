import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal, ModalContent, ModalTypes } from '../../../models/modal.model';
import { CartItem, LicensePrice, LicensePriceMapper, SDN_LINK_IMG } from '../../../models/widget.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  ModalTypes = ModalTypes;
  @Input() modalContent: ModalContent;
  @Output() modalResult: EventEmitter<any> = new EventEmitter<any>();
  // variables TERMS
  pickedLease: any;
  // variables CART
  SDN_LINK_IMG = SDN_LINK_IMG;
  LicensePriceMapper = LicensePriceMapper;

  constructor() { }

  /*
  * function common block
  */
  ngOnInit() {
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
    this.modalResult.emit({type: 'close'});
    this.modalContent.contentTerms.sliderData.forEach((button) => button.activeInModal = false);
    this.modalContent.contentTerms.rightsDescription.forEach((rights) => rights.activeInModal = false);
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
  private initCart() {}

  public deleteTrackFromCart(indexTrack: number) {
    this.modalContent.cart.totalCost = this.modalContent.cart.totalCost - this.modalContent.cart.cartItems[indexTrack].price;
    this.modalContent.cart.cartItems[indexTrack].track.inCart = false;
    this.modalContent.cart.cartItems.splice(indexTrack, 1);
  }

}

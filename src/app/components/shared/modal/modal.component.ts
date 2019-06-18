import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal, ModalContent, ModalTypes } from '../../../models/modal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  ModalTypes = ModalTypes;
  @Input() modalContent: ModalContent;
  @Output() modalResult: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    switch (this.modalContent.type) {
      case ModalTypes.TERMS: {

        break;
      }
      case ModalTypes.CART: {
        break;
      }
    }
    console.log(this.modalContent);
  }

  modalClose(): void {
    this.modalResult.emit({type: 'close'});
  }

  private invoke() {

  }

  /*
  * function block for buy-terms
  */
  public pickLease(right: any, i: number): void {
    console.log(right);
    console.log(i);
    this.modalContent.contentTerms.sliderData.forEach((button) => button.activeInModal = false);
    this.modalContent.contentTerms.rightsDescription.forEach((rights) => rights.activeInModal = false);
    this.modalContent.contentTerms.sliderData[i].activeInModal = true;
    this.modalContent.contentTerms.rightsDescription[i].activeInModal = true;
  }

  public addToCart() {
    this.modalResult.emit({type: 'addToCart', track: {...this.modalContent.contentTerms.track}});
  }

  /*
  * function block for ...
  */

}

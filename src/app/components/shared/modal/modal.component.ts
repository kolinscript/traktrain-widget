import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal, ModalContent } from '../../../models/modal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalContent: ModalContent;
  @Output() modalResult: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.modalContent);
  }

  modalClose(): void {
    this.modalResult.emit('close no result');
  }


  /*
  * function block for buy-terms
  */

  /*
  * function block for ...
  */

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Modal } from '../../../models/modal.model';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input()  modal: Modal;
  @Output() modalResult: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public modalService: ModalService
  ) { }

  ngOnInit() {
  }

  modalClose(): void {
    this.modalService.modal.modalOpen = false;
    // this.modal.emit();
  }

}

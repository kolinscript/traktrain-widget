import { Injectable } from '@angular/core';
import { Modal } from '../models/modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal: Modal = {};

  constructor() { }
}

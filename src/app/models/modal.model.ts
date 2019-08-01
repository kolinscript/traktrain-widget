import { Cart, Style, Track } from './widget.model';

export enum ModalTypes {
  TERMS = 'TERMS', CART = 'CART'
}

export interface Modal {
  modalOpen?: boolean;
  modalType?: string;
  modalContent?: ModalContent;
}

export interface ModalContent {
  style: Style;
  type?: ModalTypes;
  title?: string;
  artistName?: string;
  contentTerms?: ContentTerms; // content for type TERMS
  cart?: Cart;                 // content for type CART
}

export interface ContentTerms {
  track?: Track;
  trackIndex: number;
  paymentInfo?: any;
  sliderData?: any;
  rightsDescription?: any;
}

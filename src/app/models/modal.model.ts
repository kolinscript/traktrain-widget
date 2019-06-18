export enum ModalTypes {
  TERMS = 'TERMS', CART = 'CART'
}

export interface Modal {
  modalOpen?: boolean;
  modalType?: string;
  modalContent?: ModalContent;
}

export interface ModalContent {
  type?: ModalTypes;
  title?: string;
  contentTerms?: ContentTerms;
}

export interface ContentTerms {
  artistName?: string;
  track?: any;
  paymentInfo?: any;
  sliderData?: any;
  rightsDescription?: any;
}

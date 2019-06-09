export interface Modal {
  modalOpen?: boolean;
  modalType?: string;
  modalContent?: ModalContent;
}

export interface ModalContent {
  title?: string;

  paymentInfo?: any;
  sliderData?: any;
  mp3Leasing?: any;
  wavLeasing?: any;
  wavTrackout?: any;
  unlimited?: any;
  exclusive?: any;
}

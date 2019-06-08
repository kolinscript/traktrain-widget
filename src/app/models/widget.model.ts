export const SDN_LINK_MP3 = 'https://d2lvs3zi8kbddv.cloudfront.net/';
export const SDN_LINK_IMG = 'https://d369yr65ludl8k.cloudfront.net/';

export enum LicensePrice {
  mp3LeasePrice = 'mp3LeasePrice',
  wavLeasePrice = 'wavLeasePrice',
  wavTrackoutPrice = 'wavTrackoutPrice',
  unlimitedPrice = 'unlimitedPrice',
  exclusivePrice = 'exclusivePrice'
}

export const LicensePriceMapper = {
  [LicensePrice.mp3LeasePrice]: 'MP3 Leasing',
  [LicensePrice.wavLeasePrice]: 'Wav Leasing',
  [LicensePrice.wavTrackoutPrice]: 'Wav Trackout',
  [LicensePrice.unlimitedPrice]: 'Unlimited',
  [LicensePrice.exclusivePrice]: 'Exclusive'
};

export interface Widget {
  userMembership: UserMembership;
  socials: Socials;
  producer: Producer;
  tracks: Track[];
  style?: Style;
}

export interface Producer {
  id: number;
  userId: number;
  artistName: string;
  contact: string;
  website: string;
  shortUrl: string;
  paymentInfo: PaymentInfo;
  tags: string;
  mp3Leasing: Exclusive;
  wavLeasing: Exclusive;
  wavTrackout: Exclusive;
  unlimited: Exclusive;
  exclusive: Exclusive;
  created: Date;
  modified: Date;
  randomise: boolean;
  avatar: string;
  lbImage: string;
  profileType: string;
  randomSorting: number;
}

export interface Exclusive {
  term1: string;
  term2: string;
  term3: string;
  term4: string;
  term5?: string;
}

export interface PaymentInfo {
  paypalEmail: string;
  stripeUserId: string;
}

export interface Socials {
  id: number;
  userId: number;
  instagram: string;
}

export interface Track {
  id: number;
  link: string;
  userId: number;
  name: string;
  prices: Prices;
  image: string;
  lbImage: null | string;
  drumKit: boolean;
  drumKitInfo: DrumKitInfo;
  tags: string;
  sliderData?: any[];
  sliderIndex?: number;
  active?: boolean;
  hovered?: boolean;
  play?: boolean;
  inCart?: boolean;
}

export interface DrumKitInfo {
}

export interface Prices {
  mp3LeasePrice: number;
  wavLeasePrice?: number;
  wavTrackoutPrice?: number;
  unlimitedPrice?: number;
  exclusivePrice?: number;
}

export interface UserMembership {
  id: number;
  name: string;
  monthPrice: number;
  yearPrice: number;
  tracksCup: number;
  taggedMp3: boolean;
  exclusives: boolean;
  wavs: boolean;
  linkAccess: boolean;
  splitPayments: boolean;
  schedule: boolean;
  ads: boolean;
  monthPlanId: string;
  yearPlanId: string;
}

export interface Style {
  width: string;
  height: string;
  colors: Colors;
}

export interface Colors {
  background: string;
  text: string;
  active_item: string;
  active_accent: string;
}

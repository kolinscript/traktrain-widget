import { LicensePriceMapper } from './models/widget.model';

export function LightenDarkenColor(col, amt) {
  let usePound = false;

  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) {
    r = 255;
  } else if  (r < 0) {
    r = 0;
  }

  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  let g = (num & 0x0000FF) + amt;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

export function HexToRGB(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}

export function PriceTransformer(INPUT_PRICES: {}): {}[] {
  const OUTPUT_ARRAY = [];
  for (const key in INPUT_PRICES) {
    if (INPUT_PRICES.hasOwnProperty(key)) {
      OUTPUT_ARRAY.push({
        style: '',
        right: LicensePriceMapper[key],
        rightEnumVal: key,
        price: INPUT_PRICES[key],
        activeInModal: false,
        addedToCart: false
      });
    }
  }
  return OUTPUT_ARRAY;
}

export function CreateRightsDescriptions(array: object[], right: any): string[] {
  const rdArray = [];
  array.forEach((item) => {
    console.log(Object.values(item));
    switch (Object.values(item)[1]) {
      case 'MP3 Leasing': {
        rdArray.push({
          label: 'MP3 Leasing rights',
          rights: Object.values(right.mp3Leasing),
          activeInModal: false
        });
        break;
      }
      case 'Wav Leasing': {
        rdArray.push({
          label: 'Wav Leasing rights',
          rights: Object.values(right.wavLeasing),
          activeInModal: false
        });
        break;
      }
      case 'Wav Trackout': {
        rdArray.push({
          label: 'Wav Trackout rights',
          rights: Object.values(right.wavTrackout),
          activeInModal: false
        });
        break;
      }
      case 'Unlimited': {
        rdArray.push({
          label: 'Unlimited rights',
          rights: Object.values(right.unlimited),
          activeInModal: false
        });
        break;
      }
      case 'Exclusive': {
        rdArray.push({
          label: 'Exclusive rights',
          rights: Object.values(right.exclusive),
          activeInModal: false
        });
        break;
      }
    }
  });
  return rdArray;
}

import localFont from 'next/font/local';

// Marquisette - Heading font
export const marquisette = localFont({
  src: [
    {
      path: '../../public/fonts/Marquisette.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-marquisette',
  display: 'swap',
});

// Zabal - Body font with all weights
export const zabal = localFont({
  src: [
    {
      path: '../../public/fonts/ZabalDEMO-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-ExtraLightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-SemiBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ZabalDEMO-Ultra.otf',
      weight: '950',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ZabalDEMO-UltraItalic.otf',
      weight: '950',
      style: 'italic',
    },
  ],
  variable: '--font-zabal',
  display: 'swap',
});

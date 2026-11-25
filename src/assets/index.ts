import archWatermark from './le-r/optimized/arch-watermark.webp';
import chefMascotLockup from './le-r/optimized/chef-mascot-lockup.webp';
import chefMascotLockupSm from './le-r/optimized/chef-mascot-lockup-sm.webp';
import iconLocation from './le-r/optimized/icon-location.webp';
import iconPhone from './le-r/optimized/icon-phone.webp';
import iconSnapchat from './le-r/optimized/icon-snapchat.webp';
import iconTiktok from './le-r/optimized/icon-tiktok.webp';
import leRRingLogo from './le-r/optimized/le-r-ring-logo.webp';
import palmDesktopThree from './le-r/optimized/palm-desktop-three.webp';
import palmMobileOne from './le-r/optimized/palm-mobile-one.webp';
import palmTabletTwo from './le-r/optimized/palm-tablet-two.webp';
import redBrushOrnament from './le-r/optimized/red-brush-ornament.webp';

export const LE_R_ASSETS = {
  ringLogo: leRRingLogo,
  chefMascot: chefMascotLockup,
  chefMascotSm: chefMascotLockupSm,
  palmDesktopThree,
  palmTabletTwo,
  palmMobileOne,
  redBrushOrnament,
  archWatermark,
  contactIcons: {
    phone: iconPhone,
    location: iconLocation,
    tiktok: iconTiktok,
    snapchat: iconSnapchat,
  },
} as const;

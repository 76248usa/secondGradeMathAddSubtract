// import { useWindowDimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// /**
//  * Shared responsive helper for phones & tablets (iOS/Android/Web).
//  * - Breakpoints for small phones and tablets
//  * - Orientation flag
//  * - Gentle size scaler based on width
//  */
// export default function useResponsive() {
//   const { width, height } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   const shortest = Math.min(width, height);
//   const longest = Math.max(width, height);
//   const isLandscape = width > height;
//   const isSmallPhone = shortest < 360; // iPhone SE / compact Android
//   const isTablet = longest >= 900 || shortest >= 600; // iPad / large tablets

//   const scale = (size) => {
//     const base = 390; // iPhone 12 width baseline
//     const ratio = width / base;
//     const factor = isTablet ? 1.25 : isSmallPhone ? 0.9 : 1.0;
//     return Math.round(size * factor * Math.sqrt(ratio));
//   };

//   return { width, height, insets, isLandscape, isSmallPhone, isTablet, scale };
// }

// // hooks/useResponsive.js
// import { useWindowDimensions, Platform } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * Responsive helper:
 * - Correct tablet detection (no more false positives on iPhone Pro Max)
 * - Large-phone bucket (e.g., iPhone 15/16 Pro Max)
 * - Gentle scaling with safety clamps
 *
 *
 */

import { useWindowDimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const shortest = Math.min(width, height);
  const longest = Math.max(width, height);

  const isLandscape = width > height;

  // ✅ Tablet only if iPad or truly large min dimension
  const isPad = Platform.OS === "ios" && Platform.isPad;
  const isTablet = isPad || shortest >= 600;

  // ✅ Large iPhones (Pro/Pro Max) but not tablets
  const isLargePhone = !isTablet && shortest >= 430;

  // ✅ Small phones (SE-class)
  const isSmallPhone = shortest < 360;

  // Gentle scaler: width vs. 393pt baseline (iPhone 14/15/16)
  const scale = (size) => {
    const base = 393;
    const ratio = width / base;
    const gentle = Math.pow(ratio, 0.5);
    const deviceFactor = isTablet
      ? 1.2
      : isLargePhone
      ? 1.06
      : isSmallPhone
      ? 0.92
      : 1.0;
    const val = size * deviceFactor * gentle;
    // keep things sensible across extremes
    return Math.round(clamp(val, size * 0.85, size * 1.25));
  };

  // Useful for cards
  const cardMaxWidth = isTablet ? 720 : isLargePhone ? 520 : undefined;

  return {
    width,
    height,
    insets,
    isLandscape,
    isSmallPhone,
    isLargePhone,
    isTablet,
    scale,
    cardMaxWidth,
  };
}

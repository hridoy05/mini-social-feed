import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 768;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  return { width, isTablet };
}

export default useResponsive;

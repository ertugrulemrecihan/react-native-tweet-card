import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './icon-props';

export function LinkIcon({
  size = 16,
  color = 'currentColor',
  strokeWidth = 16,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Rect width="256" height="256" fill="none" />
      <Path
        d="M141.38,64.68l11-11a46.62,46.62,0,0,1,65.94,0h0a46.62,46.62,0,0,1,0,65.94L193.94,144,183.6,154.34a46.63,46.63,0,0,1-66-.05h0A46.48,46.48,0,0,1,104,120.06"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <Path
        d="M114.62,191.32l-11,11a46.63,46.63,0,0,1-66-.05h0a46.63,46.63,0,0,1,.06-65.89L72.4,101.66a46.62,46.62,0,0,1,65.94,0h0A46.45,46.45,0,0,1,152,135.94"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

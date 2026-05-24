import Svg, { Path, Rect } from 'react-native-svg';
import type { IconProps } from './icon-props';

export function ChatCircleIcon({
  size = 16,
  color = 'currentColor',
  strokeWidth = 16,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Rect width="256" height="256" fill="none" />
      <Path
        d="M79.93,211.11a96,96,0,1,0-35-35h0L32.42,213.46a8,8,0,0,0,10.12,10.12l37.39-12.47Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

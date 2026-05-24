import Svg, { Circle, Polyline, Rect } from 'react-native-svg';
import type { IconProps } from './icon-props';

export function CheckCircleIcon({
  size = 16,
  color = 'currentColor',
  strokeWidth = 16,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <Rect width="256" height="256" fill="none" />
      <Polyline
        points="88 136 112 160 168 104"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <Circle
        cx="128"
        cy="128"
        r="96"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

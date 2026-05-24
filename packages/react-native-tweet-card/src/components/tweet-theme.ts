/**
 * Theme values matching react-tweet (vercel/react-tweet) for consistent styling.
 */

export const tweetTheme = {
  // Light (default)
  fontColor: 'rgb(15, 20, 25)',
  fontColorSecondary: 'rgb(83, 100, 113)',
  bgColor: '#fff',
  bgColorHover: 'rgb(247, 249, 249)',
  borderColor: 'rgb(207, 217, 222)',
  bluePrimary: 'rgb(29, 155, 240)',
  bluePrimaryHover: 'rgb(26, 140, 216)',
  blueSecondary: 'rgb(0, 111, 214)',
  redPrimary: 'rgb(249, 24, 128)',
  greenPrimary: 'rgb(0, 186, 124)',
  verifiedOld: 'rgb(130, 154, 171)',
  verifiedBlue: 'rgb(29, 155, 240)',
  quotedBgHover: 'rgba(0, 0, 0, 0.03)',

  // Sizes
  containerPaddingVertical: 10,
  containerPaddingHorizontal: 12,
  avatarSize: 40,
  headerFontSize: 13,
  headerLineHeight: 17,
  bodyFontSize: 15,
  bodyLineHeight: 20,
  quotedBodyFontSize: 13,
  quotedBodyLineHeight: 17,
  infoFontSize: 12,
  actionsFontSize: 12,
  borderRadius: 12,
} as const;

export const tweetThemeDark = {
  ...tweetTheme,
  fontColor: 'rgb(247, 249, 249)',
  fontColorSecondary: 'rgb(139, 152, 165)',
  bgColor: 'rgb(21, 32, 43)',
  bgColorHover: 'rgb(30, 39, 50)',
  borderColor: 'rgb(66, 83, 100)',
  blueSecondary: 'rgb(107, 201, 251)',
  quotedBgHover: 'rgba(255, 255, 255, 0.03)',
  verifiedBlue: '#fff',
} as const;

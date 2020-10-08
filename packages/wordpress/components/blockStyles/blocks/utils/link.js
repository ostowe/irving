import { css } from 'styled-components';
import { siteTheme } from '@irvingjs/styled/utils';

/* eslint-disable max-len, indent */
const link = css`
  color: ${siteTheme('blocks.link.color', 'inherit')};
  font-weight: ${siteTheme('blocks.link.fontWeight', 'underline')};
  text-decoration: ${siteTheme('blocks.link.textDecoration', 'underline')};

  &:hover {
    color: ${siteTheme('blocks.link.hover.color', 'inherit')};
    text-decoration: ${siteTheme(
      'blocks.link.hover.textDecoration',
      'underline'
    )};
  }
`;

export default link;

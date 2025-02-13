import { getFontFaceDeclarations as getGoogleFontFaceDeclarations } from './google/get-font-face-declarations';
import { getFontFaceDeclarations as getLocalFontFaceDeclarations } from './local/get-font-face-declarations';
import type { LoaderOptions } from './types';
import { getCSSMeta } from './utils/get-css-meta';
import { setFontDeclarationsInHead } from './utils/set-font-declarations-in-head';

type FontFaceDeclaration = {
  id: string;
  fontFamily: string;
  fontFaceCSS: any;
  weights: string[];
  styles: string[];
  variable?: string;
};

export default async function storybookNextjsFontLoader(this: any) {
  const loaderOptions = this.getOptions() as LoaderOptions;
  let options;

  if (Object.keys(loaderOptions).length > 0) {
    // handles Babel mode
    options = loaderOptions;
  } else {
    // handles SWC mode
    const importQuery = JSON.parse(this.resourceQuery.slice(1));

    options = {
      filename: importQuery.path,
      fontFamily: importQuery.import,
      props: importQuery.arguments[0],
      source: this.context.replace(this.rootContext, ''),
    };
  }

  // get execution context
  const rootCtx = this.rootContext;

  let fontFaceDeclaration: FontFaceDeclaration | undefined;

  if (options.source.endsWith('next/font/google') || options.source.endsWith('@next/font/google')) {
    fontFaceDeclaration = await getGoogleFontFaceDeclarations(options);
  }

  if (options.source.endsWith('next/font/local') || options.source.endsWith('@next/font/local')) {
    fontFaceDeclaration = await getLocalFontFaceDeclarations(options, rootCtx);
  }

  if (typeof fontFaceDeclaration !== 'undefined') {
    const cssMeta = getCSSMeta(fontFaceDeclaration);

    return `
    ${setFontDeclarationsInHead({
      fontFaceCSS: cssMeta.fontFaceCSS,
      id: fontFaceDeclaration.id,
      classNamesCSS: cssMeta.classNamesCSS,
    })}

    module.exports = {
      className: "${cssMeta.className}", 
      style: ${JSON.stringify(cssMeta.style)}
      ${cssMeta.variableClassName ? `, variable: "${cssMeta.variableClassName}"` : ''}
    }
    `;
  }

  return `module.exports = {}`;
}

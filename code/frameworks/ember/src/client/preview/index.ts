import { start } from '@storybook/core-client';

import './globals';
import type { EmberFramework } from './types';
import { renderToCanvas } from './render';

const {
  configure: coreConfigure,
  clientApi,
  forceReRender,
} = start<EmberFramework>(renderToCanvas);

export const { raw } = clientApi;

const FRAMEWORK = 'ember';
export const storiesOf = (kind: string, m: any) =>
  clientApi.storiesOf(kind, m).addParameters({ framework: FRAMEWORK });
export const configure = (loadable: any, m: any) => coreConfigure(FRAMEWORK, loadable, m);

export { forceReRender };

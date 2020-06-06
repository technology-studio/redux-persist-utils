/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-17T02:03:15+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import type { Translate } from '@txo/functional'

export type PathTranslate = {
  path: string,
  translate: Translate<*>,
}

export const translateModes = {
  WHITELIST: 'whitelist',
  BLACKLIST: 'blacklist',
}

export type TranslateMode = $Values<typeof translateModes>

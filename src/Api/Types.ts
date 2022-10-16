/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-17T02:03:15+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
**/

import type { Translate } from '@txo/functional'

export type PathTranslate<VALUE> = {
  path: string,
  translate: Translate<VALUE>,
}

export enum TranslateMode {
  WHITELIST = 'whitelist',
  BLACKLIST = 'blacklist',
}

export type TranslateTransform = {
  in: <STATE extends Record<string, unknown>>(state: STATE, key: string) => Partial<STATE>,
  out: <STATE extends Record<string, unknown>>(state: STATE, key: string) => Partial<STATE>,
}

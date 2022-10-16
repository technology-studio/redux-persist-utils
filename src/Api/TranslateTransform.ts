/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-17T01:50:26+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { translateOnPath } from '@txo/functional'
import get from 'lodash.get'
import { Log } from '@txo/log'

import type {
  PathTranslate,
  TranslateTransform,
} from './Types'
import {
  TranslateMode,
} from './Types'

const log = new Log('txo.redux-persist-utils.Api.TranslateTransform')

export const createTranslateTransform = (
  rootReducerKey: string,
  inboundPathTranslateList: PathTranslate<any>[] | undefined,
  outboundPathTranslateList: PathTranslate<any>[] | undefined,
  translateMode: TranslateMode = TranslateMode.WHITELIST,
): TranslateTransform => ({
  in: <STATE extends Record<string, unknown>>(state: STATE, key: string): Partial<STATE> =>
    rootReducerKey === key && inboundPathTranslateList ? translateTransform(state, inboundPathTranslateList, translateMode) : state,
  out: <STATE extends Record<string, unknown>>(state: STATE, key: string): Partial<STATE> =>
    rootReducerKey === key && outboundPathTranslateList ? translateTransform(state, outboundPathTranslateList, translateMode) : state,
})

export const createWhitelistTransformFilter = (
  reducerKey: string,
  inboundPathTranslateList: PathTranslate<any>[] | undefined,
  outboundPathTranslateList: PathTranslate<any>[] | undefined,
): TranslateTransform => createTranslateTransform(reducerKey, inboundPathTranslateList, outboundPathTranslateList, TranslateMode.WHITELIST)

export const createBlacklistTransformFilter = (
  reducerKey: string,
  inboundPathTranslateList: PathTranslate<any>[] | undefined,
  outboundPathTranslateList: PathTranslate<any>[] | undefined,
): TranslateTransform => createTranslateTransform(reducerKey, inboundPathTranslateList, outboundPathTranslateList, TranslateMode.BLACKLIST)

const translateTransform = <STATE extends Record<string, unknown>>(state: STATE, pathTranslateList: PathTranslate<Partial<STATE>>[], translateMode: TranslateMode): Partial<STATE> => {
  switch (translateMode) {
    case TranslateMode.WHITELIST:
      return pathTranslateList.reduce((resultState, pathTranslate) => (
        translateOnPath(
          pathTranslate.path,
          resultState,
          (value) => get(state, pathTranslate.path),
          { keepEmptyObjects: true, ignoreMissingPath: true },
        )
      ) ?? {}, {})

    case TranslateMode.BLACKLIST:
      return pathTranslateList.reduce((resultState: Partial<STATE>, pathTranslate: PathTranslate<Partial<STATE>>) => {
        const _resultState: any = translateOnPath(pathTranslate.path, resultState, pathTranslate.translate, { keepEmptyObjects: true, ignoreMissingPath: true }) ?? {}
        log.debug(`PathTranslate: ${pathTranslate.path}`, { pathTranslate, resultState, _resultState })
        return _resultState
      }, state)
  }
}

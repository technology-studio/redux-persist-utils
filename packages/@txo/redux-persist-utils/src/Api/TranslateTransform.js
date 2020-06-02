/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-17T01:50:26+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { translateOnPath } from '@txo/functional'
import get from 'lodash.get'
import { Log } from '@txo-peer-dep/log'

import type { PathTranslate, TranslateMode } from './Types'
import { translateModes } from './Types'

const log = new Log('txo.redux-persist-utils.Api.TranslateTransform')

export const createTranslateTransform = (
  rootReducerKey: string,
  inboundPathTranslateList: ?PathTranslate[],
  outboundPathTranslateList: ?PathTranslate[],
  translateMode: TranslateMode = translateModes.WHITELIST,
) => ({
  in: <STATE: Object>(state: STATE, key: string): $Shape<STATE> =>
    rootReducerKey === key && inboundPathTranslateList ? translateTransform(state, inboundPathTranslateList, translateMode) : state,
  out: <STATE: Object>(state: STATE, key: string): $Shape<STATE> =>
    rootReducerKey === key && outboundPathTranslateList ? translateTransform(state, outboundPathTranslateList, translateMode) : state,
})

export const createWhitelistTransformFilter = (
  reducerKey: string,
  inboundPathTranslateList: ?PathTranslate[],
  outboundPathTranslateList: ?PathTranslate[],
) => createTranslateTransform(reducerKey, inboundPathTranslateList, outboundPathTranslateList, translateModes.WHITELIST)

export const createBlacklistTransformFilter = (
  reducerKey: string,
  inboundPathTranslateList: ?PathTranslate[],
  outboundPathTranslateList: ?PathTranslate[],
) => {
  return createTranslateTransform(reducerKey, inboundPathTranslateList, outboundPathTranslateList, translateModes.BLACKLIST)
}

const translateTransform = <STATE: Object>(state: STATE, pathTranslateList: PathTranslate[], translateMode: TranslateMode): $Shape<STATE> => {
  switch (translateMode) {
    case translateModes.WHITELIST:
      return pathTranslateList.reduce((resultState: $Shape<STATE>, pathTranslate: PathTranslate) => {
        return translateOnPath(pathTranslate.path, resultState, (value) => get(state, pathTranslate.path), { keepEmptyObjects: true, ignoreMissingPath: true }) || {}
      }, {})

    case translateModes.BLACKLIST:
      return pathTranslateList.reduce((resultState: $Shape<STATE>, pathTranslate: PathTranslate) => {
        const _resultState: any = translateOnPath(pathTranslate.path, resultState, pathTranslate.translate, { keepEmptyObjects: true, ignoreMissingPath: true }) || {}
        log.debug('PathTranslate: ' + pathTranslate.path, { pathTranslate, resultState, _resultState })
        return _resultState
      }, state)
  }

  return state
}

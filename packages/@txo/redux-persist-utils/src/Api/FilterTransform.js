/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-17T04:24:52+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { Log } from '@txo/log'

import type { PathTranslate } from './Types'
import { translateModes } from './Types'
import { createTranslateTransform } from './TranslateTransform'

const log = new Log('txo.redux-persist-utils.Api.FilterTransform')

const _createBlacklistFilterTransform = (rootReducerKey: string, pathTranslateList: PathTranslate[]) => {
  log.debug('CREATE BLACKLIST FILTER TRANSFORM', { rootReducerKey, pathTranslateList })
  return createTranslateTransform(rootReducerKey, pathTranslateList, pathTranslateList, translateModes.BLACKLIST)
}

const _populateFilterPathTranslateList = (node: Object): PathTranslate[] => {
  return Object.keys(node).reduce((result: PathTranslate[], key) => {
    const value: Object | boolean = node[key]
    if (typeof value === 'object') {
      return result.concat(_populateFilterPathTranslateList(value).map(pathTranslate => ({
        path: key + '.' + pathTranslate.path,
        translate: pathTranslate.translate,
      })))
    } else if (typeof value === 'boolean') {
      result.push({
        path: key,
        translate: (value): void => undefined,
      })
    } else if (value === '*') {
      result.push({
        path: key,
        translate: (value): Object => ({}),
      })
    } else if (typeof value === 'function') {
      result.push({
        path: key,
        translate: value,
      })
    }
    return result
  }, [])
}

export const createBlacklistFilterTransformList = (filter: Object) => {
  const keys: string[] = Object.keys(filter)
  const filterTransformList = keys.reduce((result, module) => {
    const pathTranslateList = _populateFilterPathTranslateList(filter[module])
    if (pathTranslateList.length) {
      result.push(_createBlacklistFilterTransform(module, pathTranslateList))
    }
    return result
  }, [])
  return filterTransformList
}

/**
 * @Author: Rostislav Simonik <rostislav.simonik>
 * @Date:   2018-01-17T04:24:52+01:00
 * @Email:  rostislav.simonik@technologystudio.sk
 * @Copyright: Technology Studio
 * @flow
 */

import { Log } from '@txo/log'
import type { Translate } from '@txo/functional'

import type {
  PathTranslate,
  TranslateTransform,
} from './Types'
import { TranslateMode } from './Types'
import { createTranslateTransform } from './TranslateTransform'

const log = new Log('txo.redux-persist-utils.Api.FilterTransform')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _createBlacklistFilterTransform = (rootReducerKey: string, pathTranslateList: PathTranslate<any>[]): TranslateTransform => {
  log.debug('CREATE BLACKLIST FILTER TRANSFORM', { rootReducerKey, pathTranslateList })
  return createTranslateTransform(rootReducerKey, pathTranslateList, pathTranslateList, TranslateMode.BLACKLIST)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = boolean | '*' | Translate<any> | null
type Node = Record<string, Value>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _populateFilterPathTranslateList = (node: Node): PathTranslate<any>[] => Object.keys(node).reduce((result: PathTranslate<any>[], key) => {
  const value = node[key]
  if (value === null) {
    return result
  }
  if (typeof value === 'object') {
    return result.concat(_populateFilterPathTranslateList(value).map(pathTranslate => ({
      path: `${key}.${pathTranslate.path}`,
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
      translate: (value): Record<string, unknown> => ({}),
    })
  } else if (typeof value === 'function') {
    result.push({
      path: key,
      translate: value,
    })
  }
  return result
}, [])

export const createBlacklistFilterTransformList = (filter: Record<string, Node>): TranslateTransform[] => {
  const keys: string[] = Object.keys(filter)
  const filterTransformList = keys.reduce<TranslateTransform[]>((result, module) => {
    const pathTranslateList = _populateFilterPathTranslateList(filter[module])
    if (pathTranslateList.length > 0) {
      result.push(_createBlacklistFilterTransform(module, pathTranslateList))
    }
    return result
  }, [])
  return filterTransformList
}

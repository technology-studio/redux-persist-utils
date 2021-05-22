/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2020-08-29T20:08:49+02:00
 * @Copyright: Technology Studio
**/

declare module '@txo/redux-persist-utils' {
  import type { Transform } from 'redux-persist'
  function createBlacklistFilterTransformList<HSS, ESS, STATE>(filter: Record<string, unknown> | '*'): Transform<HSS, ESS, STATE>[]
}

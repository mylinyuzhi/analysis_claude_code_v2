// ============================================================================
// /goal — command registration (dual Command: local-jsx + local twin)
//
// v2.1.183 region covered (module HPl @562048-562071; var decl @562047; EPl exports
//   `goalNonInteractive: () => Imf` + `default: () => xmf` @562046):
//   - goalLocalJsxCommand (Cmf@562050): local-jsx, immediate, interactive dialog
//   - goalCommand (Imf@562058): local twin, non-interactive / thin-client
//   - default export (xmf@562070 = Cmf)
//
// v2.1.88 convention/ancestor: src/commands/effort/index.ts — a local-jsx command
//   that is `immediate` with a lazy `load: () => import('./effort.js')`. goal mirrors
//   that shape and adds a `local` non-interactive twin (which effort lacks).
//
// 2.1.156 -> 2.1.183 delta (registration): the local-jsx description changed. In 2.1.156
//   the local-jsx command (@538354) and the local twin (@538364) shared the description
//   "Set a goal — keep working until the condition is met". In 2.1.183 the local-jsx
//   command (Cmf@562053) description is now "Set a goal Claude checks before stopping";
//   the local twin (Imf@562063) still reads "Set a goal — keep working until the
//   condition is met". (One further 156->183 delta lives in the machinery, not here:
//   the HOOKS_GATE_MESSAGE "disabled"->"restricted" — see goalNonInteractive.ts.)
//
// Cross-validation: both descriptions, flags, and gates read verbatim from the 183
//   bundle @562050-562070. Listed in extract/assets/slash_commands.json as /goal.
// ============================================================================

import type { Command } from '../../commands.js'
import { isNonInteractive, isRemoteWorkspace } from '../../state/caps.js' // xr@3151, _a@3638

// 2.1.183: goalLocalJsxCommand = Cmf @562050
// The interactive entry: opens the Ink dialog (or sets/clears a goal) immediately.
const goalLocalJsxCommand = {
  type: 'local-jsx',
  name: 'goal',
  // 2.1.156 -> 2.1.183 delta: was "Set a goal — keep working until the condition is met".
  description: 'Set a goal Claude checks before stopping', // @562053
  argumentHint: '[<condition> | clear]', // @562054
  immediate: true, // @562055
  load: () => import('./goal.js'), // bundle: Promise.resolve().then(() => (_Pl(), yPl))  @562056
} satisfies Command

// 2.1.183: goalCommand (non-interactive twin) = Imf @562058
//   (its lazy module bPl @562013 exports `call: () => wmf`, the non-interactive dispatch)
// Hidden in interactive sessions; enabled non-interactively or in a remote workspace.
// thinClientDispatch:"post-text" routes the result back as text in the thin client.
export const goalNonInteractive = {
  type: 'local',
  name: 'goal',
  supportsNonInteractive: true, // @562061
  thinClientDispatch: 'post-text', // @562062
  description: 'Set a goal — keep working until the condition is met', // — em dash  @562063
  get isHidden() {
    return !isNonInteractive() // !xr()  @562065
  },
  isEnabled: () => isNonInteractive() || isRemoteWorkspace(), // xr() || _a()  @562067
  load: () => import('./goalNonInteractive.js'), // bundle: Promise.resolve().then(() => (SPl(), bPl))  @562068
} satisfies Command

// 2.1.183: default export = xmf @562070  (= Cmf, the local-jsx command)
export default goalLocalJsxCommand

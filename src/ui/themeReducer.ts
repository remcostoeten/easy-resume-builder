export type TAction = { type: 'toggle' } | { type: 'set'; payload: 'light' | 'dark' };

export function themeReducer(state: 'light' | 'dark', action: TAction): 'light' | 'dark' {
  if (action.type === 'toggle') return state === 'light' ? 'dark' : 'light';
  if (action.type === 'set') return action.payload;
  return state;
}

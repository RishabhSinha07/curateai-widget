import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { CurateAIWidgetConfig } from '../types';

export const ConfigContext = createContext<CurateAIWidgetConfig>(null!);

export function useConfig(): CurateAIWidgetConfig {
  return useContext(ConfigContext);
}

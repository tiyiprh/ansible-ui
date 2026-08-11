import { describe, expect, test } from 'vitest';
import { INITIAL_MANAGE_VIEW_PANELS, LEADERBOARD_PANEL_IDS } from './postGaMockData';

describe('postGaMockData manage view panels', () => {
  test('should expose only four ranking panels in manage view', () => {
    expect(INITIAL_MANAGE_VIEW_PANELS).toHaveLength(4);
    expect(LEADERBOARD_PANEL_IDS).toHaveLength(4);
    expect(INITIAL_MANAGE_VIEW_PANELS.map((panel) => panel.id)).toEqual([
      ...LEADERBOARD_PANEL_IDS,
    ]);
  });
});

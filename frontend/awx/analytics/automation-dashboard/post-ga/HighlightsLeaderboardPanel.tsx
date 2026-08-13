import { Label } from '@patternfly/react-core';
import { CrownIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LeaderboardPanelCard } from './LeaderboardPanelCard';
import { LEADERBOARD_RANK_CROWN_CLASS, LeaderboardRankCell } from './LeaderboardRankCell';
import {
  HIGHLIGHTS_CURRENT_ORG,
  HIGHLIGHTS_ORG_LEADERBOARD,
  type HighlightsLeaderboardRow,
} from './postGaMockData';

type LeaderboardTableRow = HighlightsLeaderboardRow & {
  rank: number;
  isCurrentOrg?: boolean;
};

function buildOrgRows(): LeaderboardTableRow[] {
  return HIGHLIGHTS_ORG_LEADERBOARD.slice(0, 10).map((row, index) => ({
    ...row,
    rank: index + 1,
    isCurrentOrg: row.id === HIGHLIGHTS_CURRENT_ORG.id,
  }));
}

function LeaderboardRankSummary({
  rank,
  rankText,
  runsText,
}: Readonly<{ rank: number; rankText: string; runsText: string }>) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
      <div style={{ textAlign: 'right', fontSize: 12, whiteSpace: 'nowrap' }}>
        <div style={{ fontWeight: 600 }}>{rankText}</div>
        <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{runsText}</div>
      </div>
      {rank <= 3 ? (
        <CrownIcon
          className={LEADERBOARD_RANK_CROWN_CLASS[rank as 1 | 2 | 3]}
          style={{ fontSize: 30, flexShrink: 0 }}
        />
      ) : null}
    </div>
  );
}

export function HighlightsLeaderboardPanel() {
  const { t } = useTranslation();
  const orgRows = useMemo(() => buildOrgRows(), []);

  return (
    <LeaderboardPanelCard
      id="highlights-leaderboard-card"
      title={t('Top 10 organizations')}
      help={t(
        'Top 10 organizations ranked by total successful job runs in the last 30 days. Ties are broken alphabetically.'
      )}
      fitContent
      actions={
        <LeaderboardRankSummary
          rank={HIGHLIGHTS_CURRENT_ORG.rank}
          rankText={t("Your org's rank: #{{rank}}", { rank: HIGHLIGHTS_CURRENT_ORG.rank })}
          runsText={t('{{runs}} job runs', {
            runs: HIGHLIGHTS_CURRENT_ORG.runCount.toLocaleString(),
          })}
        />
      }
    >
      <Table variant="compact" borders aria-label={t('Top organizations')}>
        <Thead>
          <Tr>
            <Th style={{ width: 72, minWidth: 72 }}>{t('Rank')}</Th>
            <Th>{t('Organization')}</Th>
            <Th modifier="nowrap">{t('Total successful job runs')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orgRows.map((row) => (
            <Tr key={row.id}>
              <Td dataLabel={t('Rank')}>
                <LeaderboardRankCell position={row.rank} />
              </Td>
              <Td dataLabel={t('Organization')}>
                <span style={row.rank <= 3 ? { fontWeight: 700 } : undefined}>{row.name}</span>
                {row.isCurrentOrg ? (
                  <Label isCompact color="purple" style={{ marginLeft: 8 }}>
                    {t('Your org')}
                  </Label>
                ) : null}
              </Td>
              <Td dataLabel={t('Total successful job runs')}>{row.runCount.toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </LeaderboardPanelCard>
  );
}

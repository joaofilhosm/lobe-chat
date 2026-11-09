'use client';

import { Icon } from '@lobehub/ui';
import { type TabBarProps } from '@lobehub/ui/mobile';
import { TabBar } from '@lobehub/ui/mobile';
import { createStaticStyles } from 'antd-style';
import { Compass, MessageSquare, User } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MOBILE_TABBAR_HEIGHT } from '@/const/layoutTokens';
import { useWorkspaceAwareNavigate } from '@/features/Workspace/useWorkspaceAwareNavigate';
import { useActiveTabKey } from '@/hooks/useActiveTabKey';
import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const styles = createStaticStyles(({ css, cssVar }) => ({
  active: css`
    color: var(--app-accent, ${cssVar.colorPrimary});

    svg {
      fill: color-mix(in srgb, var(--app-accent, ${cssVar.colorPrimary}) 22%, transparent);
    }
  `,
  container: css`
    position: fixed;
    z-index: 100;
    inset-block-end: 0;
    inset-inline: 0;

    border-block-start: 1px solid ${cssVar.colorBorderSecondary};

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 82%, transparent);
    backdrop-filter: saturate(1.4) blur(16px);

    /* Thumb-sized targets: every tab is at least 44px tall and wide. */
    button,
    [role='tab'],
    a {
      min-block-size: 44px;
      min-inline-size: 44px;
    }

    @media (prefers-reduced-transparency: reduce) {
      background: ${cssVar.colorBgContainer};
      backdrop-filter: none;
    }
  `,
}));

const NavBar = memo(() => {
  const { t } = useTranslation('common');
  const activeKey = useActiveTabKey();
  const navigate = useWorkspaceAwareNavigate();

  const { showMarket } = useServerConfigStore(featureFlagsSelectors);

  const items: TabBarProps['items'] = useMemo(
    () =>
      [
        {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={MessageSquare} />
          ),
          key: SidebarTabKey.Chat,
          onClick: () => {
            navigate('/agent');
          },
          title: t('tab.chat'),
        },
        showMarket && {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={Compass} />
          ),
          key: SidebarTabKey.Community,
          onClick: () => {
            navigate('/community');
          },
          title: t('tab.community'),
        },
        {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={User} />
          ),
          key: SidebarTabKey.Me,
          onClick: () => {
            navigate('/me', { escape: true });
          },
          title: t('tab.me'),
        },
      ].filter(Boolean) as TabBarProps['items'],
    [t],
  );

  return (
    <TabBar
      activeKey={activeKey}
      className={styles.container}
      height={MOBILE_TABBAR_HEIGHT}
      items={items}
    />
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;

import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import AddonLayout from './components/addonLayout';

const ADDON_ID = 'screenreader';
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Screen Reader',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <AddonLayout />
      </AddonPanel>
    ),
  });
});

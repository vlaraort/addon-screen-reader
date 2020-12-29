import React from "react";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
import AddonLayout from "./components/addonLayout.js";

const ADDON_ID = "screenreader";
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Screen Reader",
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <AddonLayout />
      </AddonPanel>
    ),
  });
});

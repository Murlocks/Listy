import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-u"
    changePositionKey="ctrl-i"
    defaultIsVisible={true}
  >
    <LogMonitor />
  </DockMonitor>
);

export default DevTools;

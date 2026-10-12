// Feature modules mounted inside the app shell. Each one adds its render values, page view and overlays.
import dashboard from './dashboard';
import clients from './clients';
import reporting from './reporting';
import tasks from './tasks';
import goals from './goals';
import settings from './settings';

export const FEATURES = [dashboard, clients, reporting, tasks, goals, settings];

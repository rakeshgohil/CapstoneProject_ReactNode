import { CONFIG } from 'src/config-global';

import { FileManagerView } from 'src/sections/view/file-manager/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <FileManagerView />
}

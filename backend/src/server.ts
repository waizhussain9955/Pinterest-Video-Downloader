import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Pinterest Video Downloader API listening on port ${config.port}`);
});

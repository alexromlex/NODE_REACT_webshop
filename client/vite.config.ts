import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig((props) => {
  console.log('VITE PROPS: ', props);
  const env = loadEnv(props.mode, process.cwd(), 'VITE_SERVER');
  const envWithProcessPrefix = {
    'process.env': `${JSON.stringify(env)}`,
  };
  console.log('envs: ', envWithProcessPrefix);
  return {
    plugins: [react()],
    server: { watch: { usePolling: true, interval: 5000 }, port: 5226, host: true },
    define: envWithProcessPrefix,
  };
});

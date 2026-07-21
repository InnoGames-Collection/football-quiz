import './style.css';
import './ui/theme/BroadcastStyles.css';
import { bootstrapFootballLeague } from './core/engine/Bootstrap';

async function bootstrap() {
    try {
        await bootstrapFootballLeague();
    } catch (err: any) {
        console.error(err);
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '10px';
        errorDiv.style.left = '10px';
        errorDiv.style.backgroundColor = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.fontFamily = 'monospace';
        errorDiv.innerText = `Runtime Error: ${err.message || err}\n\nStack: ${err.stack || ''}`;
        document.body.appendChild(errorDiv);
    }
}

bootstrap().catch(console.error);

import { Application } from 'pixi.js';
import { COLORS } from '@agent-move/shared';

export async function createApp(container: HTMLElement): Promise<Application> {
  const app = new Application();

  // Pixi canvas resizes to fill #canvas-container (pushed by panels)
  const resizeTarget = document.getElementById('canvas-container') ?? container;

  await app.init({
    background: COLORS.background,
    resizeTo: resizeTarget,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  container.appendChild(app.canvas);

  return app;
}

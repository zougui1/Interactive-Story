const defaultZoom = 100;

export const fadeElement = (element: HTMLElement, options: FadeElementOptions = {}) => {
  const { zoom = defaultZoom } = options;
  const parent = element.parentNode;
  const { top } = element.getBoundingClientRect();
  const parentHeight = parent instanceof HTMLElement ? parent.offsetHeight : window.innerHeight;
  const windowHeight = Math.min(parentHeight, window.innerHeight);

  // Calculate the opacity based on the scroll position
  const zoomFactor = zoom / 100;
  const fadeStart = (windowHeight / 2) / zoomFactor;
  const fadeEnd = 10 / zoomFactor;
  const fadeRange = fadeStart - fadeEnd;
  const distance = top - fadeEnd;
  const opacity = Math.min(1, Math.max(0.7, distance / fadeRange));

  element.style.opacity = String(opacity);
}

export interface FadeElementOptions {
  zoom?: number;
}

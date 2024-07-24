export const fadeElement = (element: HTMLElement) => {
  const parent = element.parentNode;
  const { top } = element.getBoundingClientRect();
  const parentHeight = parent instanceof HTMLElement ? parent.offsetHeight : window.innerHeight;
  const windowHeight = Math.min(parentHeight, window.innerHeight);

  // Calculate the opacity based on the scroll position
  const fadeStart = windowHeight / 2;
  const fadeEnd = 10;
  const fadeRange = fadeStart - fadeEnd;
  const distance = top - fadeEnd;
  const opacity = Math.min(1, Math.max(0.7, distance / fadeRange));

  element.style.opacity = String(opacity);
}

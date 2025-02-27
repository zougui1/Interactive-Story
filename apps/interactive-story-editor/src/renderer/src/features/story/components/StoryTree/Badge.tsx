export const Badge = ({ children, color }: BadgeProps) => {
  const textShadow = [
    '0.5px 0.5px 0px #000',
    '-0.5px -0.5px 0px #000',
    '0.5px -0.5px 0px #000',
    '-0.5px 0.5px 0px #000',
  ].join(',');

  /**
   * make sure the text is centered if the text does not overflow, otherwise don't center it to keep it aligned to the left
   */
  const fixCentering = (element: HTMLElement | null) => {
    if (element && element.scrollWidth > element.clientWidth) {
      element.classList.remove('justify-center');
    } else {
      element?.classList.add('justify-center');
    }
  }

  return (
    <span
      ref={fixCentering}
      className="flex items-center h-5 w-7 rounded-full font-bold overflow-hidden text-ellipsis"
      style={{ backgroundColor: color, textShadow }}
    >
      {children}
    </span>
  );
}

export interface BadgeProps {
  children?: React.ReactNode;
  color?: string;
}

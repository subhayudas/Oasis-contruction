/**
 * A small hand-drawn icon set on a 24px grid with a 1.5px stroke — drawn for
 * this brand rather than pulled from a generic pack, so the service marks read
 * as construction sections rather than clip art.
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  children,
  className,
  strokeWidth = 1.5,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Interlocking pavers seen from above, one course offset. */
export function IconPaver(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6h7v5H3zM14 6h7v5h-7zM3 14h7v5H3zM14 14h7v5h-7z" />
      <path d="M10 8.5h4M10 16.5h4" />
    </Svg>
  );
}

/** A block wall in section: courses stepping back, earth behind. */
export function IconWall(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 19h16M5 19v-3.5h13M6.5 15.5V12h11M8 12V8.5h9M9.5 8.5V5.5h7" />
      <path d="M4 19.5v.5" opacity="0" />
    </Svg>
  );
}

/** A pressure-wash fan hitting a surface. */
export function IconWash(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h16" />
      <path d="M14.5 4.5 9 10" />
      <path d="M14.5 4.5h4.5v4.5" />
      <path d="m8.5 10.5-3.5 6.5M11 12l-1 5M6.5 12.5 4.5 17" />
    </Svg>
  );
}

/** A perforated drain in a bed of clear stone, water falling in. */
export function IconDrain(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 13h18" />
      <path d="M3 13v6h18v-6" />
      <path d="M7 16h1.5M11.25 16h1.5M15.5 16h1.5" />
      <path d="M8 4v4M12 3v5M16 4v4" />
    </Svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path
        d="M5 3.5h3.2l1.5 3.8-2 1.4a11.5 11.5 0 0 0 5.6 5.6l1.4-2 3.8 1.5V17c0 1.9-1.6 3.5-3.5 3.5A15.5 15.5 0 0 1 3.5 7 3.5 3.5 0 0 1 5 3.5Z"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M3 5.5h18v13H3z" />
      <path d="m3 6 9 6.5L21 6" />
    </Svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M12 21.5S4.5 14.8 4.5 10a7.5 7.5 0 1 1 15 0c0 4.8-7.5 11.5-7.5 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.4l3.4 2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconChevron(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="m9 5 7 7-7 7" />
    </Svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.6}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" strokeLinecap="round" />
      <path d="M12 16.2v.1" strokeLinecap="round" strokeWidth={2} />
    </Svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.5}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconFacebook(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.5}>
      <path d="M14.5 21v-8H17l.5-3h-3V8.2c0-.9.3-1.5 1.6-1.5H17.6V4a21 21 0 0 0-2.4-.13c-2.4 0-4 1.44-4 4.1V10H8.7v3h2.5v8" />
    </Svg>
  );
}

export const serviceIcons = {
  'pave-uni': IconPaver,
  muret: IconWall,
  'nettoyage-pression': IconWash,
  drainage: IconDrain,
} as const;

import type { GuidedIcon } from '@/content/guided';
import {
  IconBolt,
  IconCalendar,
  IconDrain,
  IconEye,
  IconPaver,
  IconPin,
  IconQuestion,
  IconSteps,
  IconWall,
  IconWash,
  IconYard,
} from '@/components/icons';

/**
 * Draws the glyph a content-layer option asked for.
 *
 * Written as a switch rather than a lookup that returns a component, so the
 * icon is chosen inside a render rather than a component being manufactured
 * during one — the second kind resets its own state on every parent render.
 */
export function GuidedGlyph({
  name,
  className,
}: {
  name: GuidedIcon | undefined;
  className?: string;
}) {
  switch (name) {
    case 'paver':
      return <IconPaver className={className} />;
    case 'wall':
      return <IconWall className={className} />;
    case 'steps':
      return <IconSteps className={className} />;
    case 'drain':
      return <IconDrain className={className} />;
    case 'wash':
      return <IconWash className={className} />;
    case 'yard':
      return <IconYard className={className} />;
    case 'question':
      return <IconQuestion className={className} />;
    case 'bolt':
      return <IconBolt className={className} />;
    case 'calendar':
      return <IconCalendar className={className} />;
    case 'eye':
      return <IconEye className={className} />;
    case 'pin':
      return <IconPin className={className} />;
    default:
      return null;
  }
}

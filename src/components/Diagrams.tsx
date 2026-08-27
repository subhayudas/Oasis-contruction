import type { Locale } from '@/lib/i18n';

/**
 * Two technical cross-sections drawn for this site. They stand in for
 * photographs the client does not have — a drain trench and a paver build-up
 * are almost always buried by the time anyone takes a picture — and they say
 * only what the service pages already say in words.
 */

const LABELS = {
  base: {
    fr: {
      title: 'Coupe type d’une surface en pavé uni',
      pavers: 'Pavé uni',
      joints: 'Sable polymère',
      bedding: 'Lit de pose',
      basecourse: 'Fondation compactée',
      geotextile: 'Membrane géotextile',
      subgrade: 'Sol en place',
      edge: 'Bordure',
    },
    en: {
      title: 'Typical cross-section of an interlocking paver surface',
      pavers: 'Interlocking pavers',
      joints: 'Polymeric sand',
      bedding: 'Bedding layer',
      basecourse: 'Compacted base',
      geotextile: 'Geotextile membrane',
      subgrade: 'Subgrade',
      edge: 'Edge restraint',
    },
  },
  drainage: {
    fr: {
      title: 'Principe d’un drain installé le long d’une surface',
      water: 'Eau de surface',
      slope: 'Pente',
      surface: 'Surface pavée',
      stone: 'Pierre nette',
      pipe: 'Drain perforé',
      geotextile: 'Membrane géotextile',
      outlet: 'Vers la sortie',
    },
    en: {
      title: 'How a drain runs alongside a surface',
      water: 'Surface water',
      slope: 'Slope',
      surface: 'Paved surface',
      stone: 'Clear stone',
      pipe: 'Perforated drain',
      geotextile: 'Geotextile membrane',
      outlet: 'To the outlet',
    },
  },
} as const;

const labelStyle = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
};

function Leader({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <>
      <path d={`M${x1} ${y1} H${x2}`} stroke="var(--color-bronze)" strokeWidth="1" />
      <circle cx={x1} cy={y1} r="2.5" fill="var(--color-bronze)" />
    </>
  );
}

export function BaseSectionDiagram({ locale }: { locale: Locale }) {
  const t = LABELS.base[locale];
  const paverXs = [24, 84, 144, 204, 264, 324];

  return (
    <svg
      viewBox="0 0 620 300"
      role="img"
      aria-label={t.title}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{t.title}</title>

      {/* Subgrade */}
      <rect x="12" y="196" width="376" height="86" fill="var(--color-limestone)" />
      <path
        d="M12 196 H388"
        stroke="color-mix(in oklab, var(--color-ink) 30%, transparent)"
        strokeWidth="1"
      />
      {Array.from({ length: 22 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + i * 17} 282 l9 -12`}
          stroke="color-mix(in oklab, var(--color-ink) 18%, transparent)"
          strokeWidth="1"
        />
      ))}

      {/* Compacted base */}
      <rect x="12" y="126" width="376" height="70" fill="var(--color-stone)" />
      {Array.from({ length: 34 }, (_, i) => {
        const cx = 22 + ((i * 53) % 358);
        const cy = 136 + ((i * 29) % 52);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.4 + ((i * 7) % 3)}
            fill="color-mix(in oklab, var(--color-ink) 22%, transparent)"
          />
        );
      })}

      {/* Geotextile */}
      <path
        d="M12 196 H388"
        stroke="var(--color-teal-deep)"
        strokeWidth="2"
        strokeDasharray="7 5"
      />

      {/* Bedding layer */}
      <rect x="12" y="110" width="376" height="16" fill="var(--color-sand)" />

      {/* Pavers */}
      {paverXs.map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="72"
            width="52"
            height="38"
            fill="var(--color-paper-2)"
            stroke="color-mix(in oklab, var(--color-ink) 38%, transparent)"
            strokeWidth="1.25"
          />
          <rect x={x + 3} y="75" width="46" height="4" fill="rgba(255,255,255,0.8)" />
        </g>
      ))}
      <rect
        x="12"
        y="72"
        width="10"
        height="38"
        fill="var(--color-paper-2)"
        stroke="color-mix(in oklab, var(--color-ink) 38%, transparent)"
        strokeWidth="1.25"
      />
      <rect
        x="378"
        y="72"
        width="10"
        height="38"
        fill="var(--color-paper-2)"
        stroke="color-mix(in oklab, var(--color-ink) 38%, transparent)"
        strokeWidth="1.25"
      />

      {/* Edge restraint */}
      <path
        d="M388 72 h26 v54 h-26 z"
        fill="var(--color-limestone)"
        stroke="color-mix(in oklab, var(--color-ink) 38%, transparent)"
        strokeWidth="1.25"
      />

      {/* Leaders + labels */}
      <Leader x1={220} y1={91} x2={440} y2={91} />
      <text x="448" y="95" fill="var(--color-ink)" style={labelStyle}>
        {t.pavers}
      </text>

      <Leader x1={136} y1={78} x2={440} y2={78} />
      <text x="448" y="60" fill="var(--color-ink)" style={labelStyle}>
        {t.joints}
      </text>
      <path d="M440 78 V56" stroke="var(--color-bronze)" strokeWidth="1" />

      <Leader x1={200} y1={118} x2={440} y2={118} />
      <text x="448" y="122" fill="var(--color-ink)" style={labelStyle}>
        {t.bedding}
      </text>

      <Leader x1={200} y1={160} x2={440} y2={160} />
      <text x="448" y="164" fill="var(--color-ink)" style={labelStyle}>
        {t.basecourse}
      </text>

      <Leader x1={300} y1={196} x2={440} y2={196} />
      <text x="448" y="200" fill="var(--color-teal-deep)" style={labelStyle}>
        {t.geotextile}
      </text>

      <Leader x1={200} y1={240} x2={440} y2={240} />
      <text x="448" y="244" fill="var(--color-ink)" style={labelStyle}>
        {t.subgrade}
      </text>

      <Leader x1={401} y1={99} x2={414} y2={99} />
      <text x="418" y="36" fill="var(--color-ink)" style={labelStyle}>
        {t.edge}
      </text>
      <path d="M414 99 V32" stroke="var(--color-bronze)" strokeWidth="1" />
    </svg>
  );
}

export function DrainageDiagram({ locale }: { locale: Locale }) {
  const t = LABELS.drainage[locale];

  return (
    <svg
      viewBox="0 0 620 300"
      role="img"
      aria-label={t.title}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{t.title}</title>

      {/* Ground */}
      <rect x="12" y="120" width="596" height="162" fill="var(--color-limestone)" />
      {Array.from({ length: 34 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + i * 17} 282 l9 -12`}
          stroke="color-mix(in oklab, var(--color-ink) 16%, transparent)"
          strokeWidth="1"
        />
      ))}

      {/* Paved surface, sloping toward the trench */}
      <path d="M12 108 L360 126 L360 148 L12 130 Z" fill="var(--color-stone)" />
      <path
        d="M12 108 L360 126"
        stroke="color-mix(in oklab, var(--color-ink) 42%, transparent)"
        strokeWidth="1.5"
      />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          d={`M${44 + i * 46} ${110 + i * 2.4} l0 20`}
          stroke="color-mix(in oklab, var(--color-ink) 26%, transparent)"
          strokeWidth="1"
        />
      ))}

      {/* Slope indicator */}
      <path
        d="M60 96 L330 110"
        stroke="var(--color-teal-deep)"
        strokeWidth="1.5"
        strokeDasharray="6 5"
      />
      <path
        d="M330 110 l-11 -5 m11 5 l-11 6"
        stroke="var(--color-teal-deep)"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="60" y="86" fill="var(--color-teal-deep)" style={labelStyle}>
        {t.slope}
      </text>

      {/* Water arrows. The one place on the site where movement carries
          information rather than emphasis: the drawing says water lands here
          and leaves there, and the motion says it in the order it happens. */}
      {[110, 170, 230].map((x, i) => (
        <path
          key={x}
          className="flow-water"
          style={{ animationDelay: `${i * 320}ms` }}
          d={`M${x} ${52 + i * 2} v22 m0 0 l-5 -6 m5 6 l5 -6`}
          stroke="var(--color-teal)"
          strokeWidth="1.6"
          fill="none"
        />
      ))}
      <text x="96" y="42" fill="var(--color-teal-deep)" style={labelStyle}>
        {t.water}
      </text>

      {/* Trench */}
      <path
        d="M362 126 h96 v130 h-96 z"
        fill="var(--color-sand)"
        stroke="color-mix(in oklab, var(--color-ink) 26%, transparent)"
        strokeWidth="1"
      />
      {Array.from({ length: 30 }, (_, i) => {
        const cx = 372 + ((i * 37) % 78);
        const cy = 140 + ((i * 43) % 100);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={3 + ((i * 5) % 3)}
            fill="none"
            stroke="color-mix(in oklab, var(--color-ink) 30%, transparent)"
            strokeWidth="1.1"
          />
        );
      })}

      {/* Geotextile wrap */}
      <path
        d="M356 120 L356 262 L464 262 L464 120"
        fill="none"
        stroke="var(--color-teal-deep)"
        strokeWidth="2"
        strokeDasharray="7 5"
      />

      {/* Perforated pipe */}
      <ellipse
        cx="410"
        cy="228"
        rx="26"
        ry="18"
        fill="var(--color-paper)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      {[-14, -4, 6, 16].map((dx) => (
        <path key={dx} d={`M${410 + dx} 213 v-4`} stroke="var(--color-ink)" strokeWidth="1.5" />
      ))}

      {/* Outlet. The dashes march toward the arrowhead, which is the whole
          point of the drawing: the trench is not a hole, it is a route. */}
      <path
        className="flow-dash"
        d="M436 228 H560"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6 5"
      />
      {/* The head stays solid: a dashed arrow that marches is a flow, a
          dashed arrowhead is just a shimmer. */}
      <path
        d="M560 228 l-11 -6 m11 6 l-11 6"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        fill="none"
      />
      <text x="470" y="216" fill="var(--color-ink)" style={labelStyle}>
        {t.outlet}
      </text>

      {/* Labels */}
      <Leader x1={200} y1={137} x2={252} y2={137} />
      <text x="118" y="167" fill="var(--color-ink)" style={labelStyle}>
        {t.surface}
      </text>
      <path
        d="M252 137 L252 158 L200 158"
        stroke="var(--color-bronze)"
        strokeWidth="1"
        fill="none"
      />

      <Leader x1={410} y1={160} x2={520} y2={160} />
      <text x="528" y="164" fill="var(--color-ink)" style={labelStyle}>
        {t.stone}
      </text>

      <Leader x1={410} y1={246} x2={500} y2={280} />
      <path
        d="M410 246 L500 280 H556"
        stroke="var(--color-bronze)"
        strokeWidth="1"
        fill="none"
      />
      <text x="440" y="296" fill="var(--color-ink)" style={labelStyle}>
        {t.pipe}
      </text>

      <text x="12" y="296" fill="var(--color-teal-deep)" style={labelStyle}>
        {t.geotextile}
      </text>
      <path
        d="M112 291 H356 V262"
        stroke="var(--color-teal-deep)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function ServiceDiagram({
  kind,
  locale,
}: {
  kind: 'base' | 'drainage';
  locale: Locale;
}) {
  return kind === 'base' ? (
    <BaseSectionDiagram locale={locale} />
  ) : (
    <DrainageDiagram locale={locale} />
  );
}

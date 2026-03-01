type WaveVariant = "soft" | "medium" | "bold";

interface WaveSeparatorProps {
  colorClassName?: string;
  secondaryColorClassName?: string;
  flip?: boolean;
  heightClassName?: string;
  variant?: WaveVariant;
  className?: string;
  bgColor?: string;
}

const WAVE_PATHS: Record<WaveVariant, { back: string; front: string }> = {
  soft: {
    back: "M0,112 C90,52 128,50 164,106 C198,152 252,150 290,102 C334,46 378,42 424,96 C466,144 524,144 570,100 C620,52 680,44 742,94 C804,142 870,144 932,98 C992,54 1062,46 1134,92 C1200,134 1276,134 1348,98 C1388,80 1422,80 1440,90 L1440,180 L0,180 Z",
    front:
      "M0,122 C86,58 124,56 160,114 C194,160 248,160 288,108 C334,48 380,46 426,102 C470,152 532,152 580,106 C632,54 694,48 758,100 C822,154 892,156 956,108 C1018,58 1090,52 1164,100 C1234,146 1308,146 1372,108 C1406,92 1430,92 1440,96 L1440,180 L0,180 Z",
  },
  medium: {
    back: "M0,124 C92,32 132,28 176,122 C214,178 264,170 304,96 C352,24 390,20 436,116 C476,172 534,170 578,98 C630,36 686,28 746,90 C808,152 872,164 934,110 C988,62 1052,26 1124,84 C1192,138 1268,156 1336,108 C1378,84 1412,84 1440,96 L1440,180 L0,180 Z",
    front:
      "M0,136 C88,40 126,36 172,132 C212,184 266,178 308,104 C360,28 400,24 448,124 C490,176 552,176 598,106 C654,42 714,34 778,100 C846,164 916,170 980,118 C1038,68 1108,34 1182,94 C1252,146 1322,162 1384,118 C1418,98 1438,98 1440,104 L1440,180 L0,180 Z",
  },
  bold: {
    back: "M0,138 C90,24 132,20 182,136 C226,188 278,180 322,96 C378,16 420,14 470,130 C514,184 574,182 622,104 C682,28 744,22 812,94 C882,162 956,170 1028,118 C1092,72 1168,28 1248,94 C1314,146 1368,150 1414,122 C1428,112 1438,110 1440,110 L1440,180 L0,180 Z",
    front:
      "M0,152 C88,32 130,30 180,148 C224,194 282,188 328,108 C388,26 432,24 486,142 C532,190 598,190 648,114 C710,36 774,30 844,104 C916,170 996,176 1068,126 C1134,78 1210,36 1292,104 C1352,148 1398,150 1430,130 C1438,124 1440,124 1440,124 L1440,180 L0,180 Z",
  },
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function WaveSeparator({
  colorClassName = "text-[#FAF7EF]",
  secondaryColorClassName,
  flip = false,
  heightClassName = "h-12 md:h-20",
  variant = "medium",
  className,
  bgColor,
}: WaveSeparatorProps) {
  return (
    <div className={joinClasses("relative w-full overflow-hidden leading-0", className)}>
      <svg
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className={joinClasses(
          "block w-full",
          heightClassName,
          flip ? "rotate-180" : "",
        )}
      >
        <path
          d={WAVE_PATHS[variant].front}
          className={joinClasses(
            "fill-current",
            secondaryColorClassName ?? colorClassName,
          )}
          style={bgColor ? { fill: bgColor } : undefined}
        />
      </svg>
    </div>
  );
}

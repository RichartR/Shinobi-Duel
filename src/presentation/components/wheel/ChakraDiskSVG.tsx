import React from 'react';
import { WheelSegment, WHEEL_COLORS } from '../../../domain/models/ShinobiFigure';

interface ChakraDiskSVGProps {
  figure: {
    id: string;
    kanji?: string;
    segments: WheelSegment[];
  };
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeWedge(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArc, 0, end.x, end.y, 'Z'].join(' ');
}

export const ChakraDiskSVG: React.FC<ChakraDiskSVGProps> = ({ figure, size = 160 }) => {
  if (!figure) return null;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 5;
  const total = figure.segments.reduce((acc, s) => acc + s.size, 0) || 96;

  let currentAngle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none" aria-label="Ruleta de Chakra de 96 segmentos">
      <circle cx={cx} cy={cy} r={r + 3} fill="#281b12" stroke="#b45309" strokeWidth="2.5" />
      {figure.segments.map((seg, idx) => {
        const sliceAngle = (seg.size / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const pathD = describeWedge(cx, cy, r, startAngle, endAngle);
        const col = WHEEL_COLORS[seg.color] || WHEEL_COLORS.white;
        const midAngle = startAngle + sliceAngle / 2;
        const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);

        let labelText: string | number = '';
        if (seg.color === 'white' || seg.color === 'gold') labelText = seg.power;
        else if (seg.color === 'purple') labelText = '★'.repeat(seg.stars);
        else if (seg.color === 'blue') labelText = '避';
        else labelText = '失';

        return (
          <g key={`${figure.id}_seg_${idx}`}>
            <path d={pathD} fill={col.fill} stroke="#1c120c" strokeWidth="1.8" />
            {sliceAngle >= 18 && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill={seg.color === 'white' || seg.color === 'gold' ? '#0f172a' : '#ffffff'}
                fontSize={size > 140 ? '11' : '9'}
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {labelText}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.23} fill="#1c120c" stroke="#d97706" strokeWidth="2" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f59e0b"
        fontSize={size > 140 ? '14' : '11'}
        fontWeight="900"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      >
        {figure.kanji || '忍'}
      </text>
    </svg>
  );
};

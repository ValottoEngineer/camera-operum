import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Polyline, Line, Circle, Text as SvgText } from 'react-native-svg';
import { theme } from '../../styles/theme';

interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  width = screenWidth - 40,
  height = 200,
  color = theme.colors.neon.electric,
  showDots = true,
  showGrid = true,
  showLabels = true,
}) => {
  if (!data || data.length < 2) {
    return (
      <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.neutral.secondary }}>
          Dados insuficientes para o gráfico
        </Text>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Encontrar valores mínimos e máximos
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));

  // Adicionar margem de 10% nos valores Y
  const yRange = maxY - minY;
  const yMin = minY - yRange * 0.1;
  const yMax = maxY + yRange * 0.1;

  // Converter dados para coordenadas do SVG
  const points = data.map(d => {
    const x = padding + ((d.x - minX) / (maxX - minX)) * chartWidth;
    const y = padding + ((yMax - d.y) / (yMax - yMin)) * chartHeight;
    return { x, y, originalData: d };
  });

  // Criar string de pontos para Polyline
  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  // Gerar linhas de grade
  const gridLines = [];
  if (showGrid) {
    // Linhas horizontais
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      gridLines.push(
        <Line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke={theme.colors.neutral.border}
          strokeWidth={1}
          opacity={0.3}
        />
      );
    }

    // Linhas verticais
    for (let i = 0; i <= 4; i++) {
      const x = padding + (chartWidth / 4) * i;
      gridLines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + chartHeight}
          stroke={theme.colors.neutral.border}
          strokeWidth={1}
          opacity={0.3}
        />
      );
    }
  }

  // Gerar labels do eixo Y
  const yLabels = [];
  if (showLabels) {
    for (let i = 0; i <= 4; i++) {
      const value = yMax - (yRange * 1.2 / 4) * i;
      const y = padding + (chartHeight / 4) * i;
      yLabels.push(
        <SvgText
          key={`y-${i}`}
          x={padding - 10}
          y={y + 4}
          fontSize="12"
          fill={theme.colors.neutral.secondary}
          textAnchor="end"
        >
          {value.toFixed(0)}
        </SvgText>
      );
    }
  }

  // Gerar labels do eixo X
  const xLabels = [];
  if (showLabels) {
    for (let i = 0; i <= 4; i++) {
      const value = minX + (maxX - minX) / 4 * i;
      const x = padding + (chartWidth / 4) * i;
      xLabels.push(
        <SvgText
          key={`x-${i}`}
          x={x}
          y={height - 10}
          fontSize="12"
          fill={theme.colors.neutral.secondary}
          textAnchor="middle"
        >
          {value.toString()}
        </SvgText>
      );
    }
  }

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Linhas de grade */}
        {gridLines}
        
        {/* Linha do gráfico */}
        <Polyline
          points={pointsString}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Pontos do gráfico */}
        {showDots && points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            stroke={theme.colors.surface}
            strokeWidth="2"
          />
        ))}
        
        {/* Labels dos eixos */}
        {yLabels}
        {xLabels}
      </Svg>
    </View>
  );
};

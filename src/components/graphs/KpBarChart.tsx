import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';

interface KpData {
  time_tag: string;
  Kp: string;
  a_running: string;
  station_count: string;
}

interface KpIndexChartProps {
  data: any;
}

const KpBarChart: React.FC<KpIndexChartProps> = ({ data }) => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const PADDING = 40;
  const WIDTH = SCREEN_WIDTH - (PADDING * 2);
  const HEIGHT = 300;
  const BAR_PADDING = 2;

  // Calculate bar width based on data length
  const barWidth = (WIDTH - (data.length * BAR_PADDING)) / data.length;

  // Y-axis scale (Kp index goes from 0 to 9)
  const yScale = (value: number) => {
    return HEIGHT - (value / 9) * HEIGHT;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}\n${date.getHours()}:00`;
  };

  // Get bar color based on Kp value
  const getBarColor = (kp: number) => {
    if (kp >= 5) return '#ef4444';      // Red
    if (kp >= 4) return '#f97316';      // Orange
    if (kp >= 3) return '#facc15';      // Yellow
    return '#22c55e';                   // Green
  };

  return (
    <ScrollView horizontal>
      <View style={{ paddingHorizontal: PADDING }}>
        <Svg width={WIDTH + PADDING} height={HEIGHT + 60}>
          {/* Y-axis */}
          <Line
            x1={0}
            y1={0}
            x2={0}
            y2={HEIGHT}
            stroke="gray"
            strokeWidth={1}
          />

          {/* X-axis */}
          <Line
            x1={0}
            y1={HEIGHT}
            x2={WIDTH}
            y2={HEIGHT}
            stroke="gray"
            strokeWidth={1}
          />

          {/* Y-axis labels and grid lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
            <G key={`y-axis-${value}`}>
              <Line
                x1={0}
                y1={yScale(value)}
                x2={WIDTH}
                y2={yScale(value)}
                stroke="gray"
                strokeWidth={0.5}
                opacity={0.5}
              />
              <SvgText
                x={-25}
                y={yScale(value) + 5}
                fill="gray"
                fontSize="10"
                textAnchor="start"
              >
                {value}
              </SvgText>
            </G>
          ))}

          {/* Bars */}
          {data.map((item: any, index: number) => {
            const kpValue = parseFloat(item.Kp);
            const barHeight = HEIGHT - yScale(kpValue);
            const x = index * (barWidth + BAR_PADDING);

            return (
              <G key={`bar-${index}`}>
                <Rect
                  x={x}
                  y={HEIGHT - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={getBarColor(kpValue)}
                  rx={2}
                  ry={2}
                />
                <SvgText
                  x={x + (barWidth / 2)}
                  y={HEIGHT + 20}
                  fill="gray"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {formatDate(item.time_tag)}
                </SvgText>
              </G>
            );
          })}

          {/* Y-axis label */}
          <SvgText
            x={-HEIGHT / 2}
            y={-30}
            fill="gray"
            fontSize="12"
            textAnchor="middle"
            rotation={-90}
          >
            Kp Index
          </SvgText>
        </Svg>
      </View>
    </ScrollView>
  );
};

export default KpBarChart;
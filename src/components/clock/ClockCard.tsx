import { View, Text } from "react-native";
import { Svg, Circle, Line } from "react-native-svg";
import { Dayjs } from "dayjs";
import { clockCardStyles } from "../../styles/components/clock/clockCard";
import { app_colors } from "../../helpers/constants";

type ClockCardProps = {
  time: Dayjs;
  showAnalog: boolean;
  timezone: string;
};

const center = 60;
const clockRadius = 58;

const polarToCartesian = (angleDeg: number, radius: number) => {
  const angleRad = (Math.PI / 180) * angleDeg - Math.PI / 2;

  return {
    x: center + radius * Math.cos(angleRad),
    y: center + radius * Math.sin(angleRad),
  };
};

const renderTicks = () => {
  const minuteTicks = Array.from({ length: 60 }).map((_, index) => {
    const angle = (index / 60) * 360;
    const isHour = index % 5 === 0;
    const start = polarToCartesian(angle, isHour ? clockRadius - 8 : clockRadius - 5);
    const end = polarToCartesian(angle, clockRadius - 2);

    return (
      <Line
        key={`tick-${index}`}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={isHour ? app_colors.white : app_colors.white_eighty}
        strokeWidth={isHour ? 2.5 : 1.5}
        strokeLinecap="round"
        opacity={1}
      />
    );
  });

  return minuteTicks;
};

const renderAnalogFace = (time: Dayjs) => {
  const hours = time.hour() % 12;
  const minutes = time.minute();
  const seconds = time.second();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const hourHand = polarToCartesian(hourAngle, 26);
  const minuteHand = polarToCartesian(minuteAngle, 38);
  const secondHand = polarToCartesian(secondAngle, 40);
  const secondTail = polarToCartesian(secondAngle + 180, 10);

  return (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      {/* dial base */}
      <Circle
        cx={center}
        cy={center}
        r={clockRadius}
        fill={app_colors.black}
        opacity={0.5}
      />
      {/* outer ring */}
      {/* <Circle
        cx={center}
        cy={center}
        r={clockRadius - 3}
        stroke={app_colors.white_twenty}
        strokeWidth={2.5}
        fill="none"
      /> */}
      {/* ticks */}
      {renderTicks()}
      {/* small center fill */}
      <Circle
        cx={center}
        cy={center}
        r={3}
        fill={app_colors.white}
        opacity={0.8}
      />
      {/* hour hand */}
      <Line
        x1={center}
        y1={center}
        x2={hourHand.x}
        y2={hourHand.y}
        stroke={app_colors.white}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* minute hand */}
      <Line
        x1={center}
        y1={center}
        x2={minuteHand.x}
        y2={minuteHand.y}
        stroke={app_colors.white}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* seconds hand */}
      <Line
        x1={center}
        y1={center}
        x2={secondHand.x}
        y2={secondHand.y}
        stroke={app_colors.yellow}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* seconds counterweight */}
      <Line
        x1={center}
        y1={center}
        x2={secondTail.x}
        y2={secondTail.y}
        stroke={app_colors.yellow}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.8}
      />
      {/* central cap */}
      {/* <Circle
        cx={center}
        cy={center}
        r={5}
        fill={app_colors.black}
        stroke={app_colors.white}
        strokeWidth={2}
      /> */}
    </Svg>
  );
};

export const ClockCard = ({ time, showAnalog, timezone }: ClockCardProps) => {
  const digitalTime = time.format('HH:mm:ss');
  const dateLabel = time.format('dddd DD MMM YYYY');

  return (
    <View style={clockCardStyles.card}>
      <View style={clockCardStyles.card.overlay} />
      <View style={clockCardStyles.card.content}>
        <View style={clockCardStyles.card.left}>
          <Text style={clockCardStyles.card.left.label}>{timezone}</Text>
          <Text style={clockCardStyles.card.left.time}>{digitalTime}</Text>
          <Text style={clockCardStyles.card.left.meta}>{dateLabel}</Text>
        </View>
        {showAnalog && (
          <View style={clockCardStyles.card.analogWrapper}>
            {renderAnalogFace(time)}
          </View>
        )}
      </View>
    </View>
  );
};

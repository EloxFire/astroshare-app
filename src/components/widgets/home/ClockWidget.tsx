import { useEffect, useMemo, useState } from "react"
import { Text, View } from "react-native"
import dayjs, { Dayjs } from "dayjs"
import { clockWidgetStyles } from "../../../styles/components/widgets/home/clockWidget"
import { i18n } from "../../../helpers/scripts/i18n"

export const ClockWidget = () => {
  const [now, setNow] = useState<Dayjs>(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const timezoneLabel = useMemo(() => {
    try {
      const parts = Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(new Date())
      return parts.find((part) => part.type === 'timeZoneName')?.value ?? dayjs().format('z')
    } catch (error) {
      return dayjs.tz?.guess()?.replace(/_/g, ' ') ?? 'Local'
    }
  }, [])

  const localTime = now.format('HH:mm:ss')
  const localDate = now.format('dddd DD MMM YYYY')
  const utc = now.utc()
  const utcTime = utc.format('HH:mm:ss')
  const utcDate = utc.format('dddd DD MMM YYYY')
  const localTitle = i18n.t('widgets.homeWidgets.clock.local.title')
  const utcTitle = i18n.t('widgets.homeWidgets.clock.utc.title')
  const utcSubtitle = i18n.t('widgets.homeWidgets.clock.utc.subtitle')

  return (
    <View style={clockWidgetStyles.widget}>
      <View style={clockWidgetStyles.widget.overlay} />
      <View style={clockWidgetStyles.widget.content}>
        <View style={clockWidgetStyles.widget.section}>
          <Text style={clockWidgetStyles.widget.section.label}>{localTitle}</Text>
          <Text style={clockWidgetStyles.widget.section.time}>{localTime}</Text>
          <Text style={clockWidgetStyles.widget.section.meta}>{timezoneLabel}</Text>
          <Text style={clockWidgetStyles.widget.section.date}>{localDate}</Text>
        </View>
        <View style={clockWidgetStyles.widget.divider} />
        <View style={clockWidgetStyles.widget.section}>
          <Text style={clockWidgetStyles.widget.section.label}>{utcTitle}</Text>
          <Text style={clockWidgetStyles.widget.section.time}>{utcTime}</Text>
          <Text style={clockWidgetStyles.widget.section.meta}>{utcSubtitle}</Text>
          <Text style={clockWidgetStyles.widget.section.date}>{utcDate}</Text>
        </View>
      </View>
    </View>
  )
}

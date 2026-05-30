import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { DSO } from '../../helpers/types/DSO'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { SpecialSkyObject } from '../../helpers/types/SpecialSkyObject'
import { app_colors } from '../../helpers/constants'
import { i18n } from '../../helpers/scripts/i18n'
import { universalObjectSearch } from '../../helpers/scripts/universalObjectSearch'

const t = (path: string) =>
  i18n.t(`telescopeSimulator.home.sections.target.picker.${path}`)

type SearchResult =
  | { kind: 'planet'; data: GlobalPlanet | SpecialSkyObject }
  | { kind: 'dso'; data: DSO }

interface ObjectPickerModalProps {
  visible: boolean
  planets: GlobalPlanet[]
  dsoCatalog: DSO[]
  dsoCatalogLoading: boolean
  onClose: () => void
  onSelectDSO: (dso: DSO) => void
  onSelectPlanet: (planet: GlobalPlanet | SpecialSkyObject) => void
}

const formatAngularSize = (majAx: number | string): string => {
  const arcmin = parseFloat(String(majAx))
  if (isNaN(arcmin) || arcmin === 0) return ''
  if (arcmin >= 60) return `${(arcmin / 60).toFixed(1)}°`
  return `${arcmin.toFixed(1)}'`
}

export const ObjectPickerModal = ({
  visible,
  planets,
  dsoCatalog,
  dsoCatalogLoading,
  onClose,
  onSelectDSO,
  onSelectPlanet,
}: ObjectPickerModalProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!visible) {
      setQuery('')
      setResults([])
    }
  }, [visible])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const { planetResults, dsoResults } = await universalObjectSearch(
        query.trim(),
        planets,
        undefined,
        dsoCatalog,
      )
      const combined: SearchResult[] = [
        ...planetResults.map((p) => ({ kind: 'planet' as const, data: p })),
        ...dsoResults.map((d) => ({ kind: 'dso' as const, data: d })),
      ]
      setResults(combined)
      setSearching(false)
    }, 300)
  }, [query])

  const handleSelect = (item: SearchResult) => {
    if (item.kind === 'planet') onSelectPlanet(item.data)
    else onSelectDSO(item.data)
    onClose()
  }

  const renderItem = ({ item }: { item: SearchResult }) => {
    if (item.kind === 'planet') {
      const p = item.data
      const name = 'family' in p ? p.name : (p as GlobalPlanet).name
      const subtitle = 'family' in p ? (p as SpecialSkyObject).family : 'Planète'
      return (
        <TouchableOpacity style={styles.resultRow} onPress={() => handleSelect(item)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultName}>{name}</Text>
            <Text style={styles.resultSub}>{subtitle}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    const dso = item.data as DSO
    const name = dso.common_names?.split(',')[0]?.trim() || dso.name
    const size = formatAngularSize(dso.maj_ax)
    return (
      <TouchableOpacity style={styles.resultRow} onPress={() => handleSelect(item)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resultName}>{name}</Text>
          <Text style={styles.resultSub}>{dso.type}{size ? ` · ${size}` : ''}</Text>
        </View>
        {dso.m ? (
          <Text style={styles.catalogBadge}>M{dso.m}</Text>
        ) : dso.ngc ? (
          <Text style={styles.catalogBadge}>NGC {dso.ngc}</Text>
        ) : null}
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('title')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Catalog loading notice */}
          {dsoCatalogLoading && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <ActivityIndicator size="small" color={app_colors.white_forty} />
              <Text style={{ color: app_colors.white, fontFamily: 'DMMonoRegular', fontSize: 10, opacity: 0.4 }}>
                Chargement du catalogue…
              </Text>
            </View>
          )}

          {/* Search input */}
          <TextInput
            style={styles.input}
            placeholder={t('placeholder')}
            placeholderTextColor={app_colors.white_forty}
            value={query}
            onChangeText={setQuery}
            autoFocus
            clearButtonMode="while-editing"
          />

          {/* Results */}
          {searching && (
            <ActivityIndicator color={app_colors.white} style={{ marginTop: 20 }} />
          )}
          {!searching && results.length === 0 && query.length >= 2 && (
            <Text style={styles.emptyText}>{t('noResults')}</Text>
          )}
          <FlatList
            data={results}
            keyExtractor={(item, idx) =>
              item.kind === 'dso'
                ? `dso-${(item.data as DSO).name}-${idx}`
                : `planet-${idx}`
            }
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: app_colors.white_no_opacity }} />
            )}
          />

        </View>
      </View>
    </Modal>
  )
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: app_colors.black_modal,
    justifyContent: 'flex-end' as const,
  },
  sheet: {
    backgroundColor: '#0d0d0d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: '85%' as const,
    minHeight: '50%' as const,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  title: {
    color: app_colors.white,
    fontFamily: 'GilroyBlack',
    fontSize: 18,
  },
  closeBtn: {
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 18,
    opacity: 0.6,
  },
  input: {
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 10,
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 15,
    padding: 12,
    marginBottom: 12,
  },
  emptyText: {
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 14,
    opacity: 0.4,
    textAlign: 'center' as const,
    marginTop: 20,
  },
  resultRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    gap: 8,
  },
  resultName: {
    color: app_colors.white,
    fontFamily: 'GilroyBold',
    fontSize: 15,
  },
  resultSub: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 10,
    opacity: 0.5,
    marginTop: 2,
  },
  catalogBadge: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 10,
    opacity: 0.4,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
}

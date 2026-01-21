import React, { useEffect, useState } from "react"
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import PageTitle from "../../components/commons/PageTitle"
import SimpleButton from "../../components/commons/buttons/SimpleButton"
import ScreenInfo from "../../components/ScreenInfo"
import { app_colors, storageKeys } from "../../helpers/constants"
import { defaultChecklist } from "../../helpers/scripts/checklists/defaultChecklists"
import { i18n } from "../../helpers/scripts/i18n"
import { getObject, storeObject } from "../../helpers/storage"
import { globalStyles } from "../../styles/global"
import { checklistsHomeStyles } from "../../styles/screens/checklists/home"
import InputWithIcon from "../../components/forms/InputWithIcon"
import { ChecklistComponent } from "../../components/checklists/ChecklistComponent"

type ChecklistItem = { id: string; text: string; completed: boolean }
type Checklist = { id: string; title: string; description?: string; items: ChecklistItem[] }

export const ChecklistsHome = ({ navigation }: any) => {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(true)
  const [newChecklistTitle, setNewChecklistTitle] = useState('')
  const [newChecklistDescription, setNewChecklistDescription] = useState('')
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({})
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const initializeChecklists = async () => {
      const savedChecklists = await getObject(storageKeys.checklists)

      if (savedChecklists && Array.isArray(savedChecklists)) {
        setChecklists(savedChecklists)
        setExpandedChecklists(savedChecklists.reduce((acc: Record<string, boolean>, checklist: Checklist) => {
          acc[checklist.id] = false
          return acc
        }, {}))
      } else {
        const initialChecklist: Checklist = {
          ...defaultChecklist,
          items: defaultChecklist.items.map(item => ({ ...item })),
        }
        setChecklists([initialChecklist])
        setExpandedChecklists({ [initialChecklist.id]: false })
        await storeObject(storageKeys.checklists, [initialChecklist])
      }

      setLoading(false)
    }

    initializeChecklists()
  }, [])

  const persistChecklists = async (updated: Checklist[]) => {
    setChecklists(updated)
    await storeObject(storageKeys.checklists, updated)
  }

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return

    const newChecklist: Checklist = {
      id: `checklist-${Date.now()}`,
      title: newChecklistTitle.trim(),
      description: newChecklistDescription.trim(),
      items: [],
    }

    await persistChecklists([...checklists, newChecklist])
    setExpandedChecklists(prev => ({ ...prev, [newChecklist.id]: false }))
    setNewChecklistTitle('')
    setNewChecklistDescription('')
  }

  const handleDeleteChecklist = async (checklistId: string) => {
    const updated = checklists.filter(checklist => checklist.id !== checklistId)
    await persistChecklists(updated)
    setExpandedChecklists(prev => {
      const next = { ...prev }
      delete next[checklistId]
      return next
    })
  }

  const handleToggleItem = async (checklistId: string, itemId: string) => {
    const updated = checklists.map(checklist => {
      if (checklist.id !== checklistId) return checklist
      return {
        ...checklist,
        items: checklist.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item),
      }
    })
    await persistChecklists(updated)
  }

  const handleDeleteItem = async (checklistId: string, itemId: string) => {
    const updated = checklists.map(checklist => {
      if (checklist.id !== checklistId) return checklist
      return {
        ...checklist,
        items: checklist.items.filter(item => item.id !== itemId),
      }
    })
    await persistChecklists(updated)
  }

  const handleAddItem = async (checklistId: string) => {
    const value = (newItemInputs[checklistId] || '').trim()
    if (!value) return

    const updated = checklists.map(checklist => {
      if (checklist.id !== checklistId) return checklist
      return {
        ...checklist,
        items: [
          ...checklist.items,
          { id: `${checklistId}-${Date.now()}`, text: value, completed: false },
        ],
      }
    })

    setNewItemInputs(prev => ({ ...prev, [checklistId]: '' }))
    await persistChecklists(updated)
  }

  const toggleChecklist = (checklistId: string) => {
    setExpandedChecklists(prev => ({ ...prev, [checklistId]: !prev[checklistId] }))
  }

  const renderChecklist = (checklist: Checklist) => {
    const completedCount = checklist.items.filter(item => item.completed).length
    const expanded = expandedChecklists[checklist.id]

    return (
      <ChecklistComponent
        key={checklist.id}
        checklist={checklist}
        expanded={expanded}
        onToggleExpand={() => toggleChecklist(checklist.id)}
        onDelete={() => handleDeleteChecklist(checklist.id)}
        completedCount={completedCount}
        onUpdate={{
          handleAddItem,
          handleDeleteItem,
          handleToggleItem,
          newItemInput: newItemInputs[checklist.id] || '',
          setNewItemInput: (text: string) => setNewItemInputs(prev => ({ ...prev, [checklist.id]: text })),
        }}
      />
    )
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('checklistManager.title')}
        subtitle={i18n.t('checklistManager.subtitle')}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={checklistsHomeStyles.content}>
        <View style={checklistsHomeStyles.creationCard}>
          <Text style={checklistsHomeStyles.creationCard.title}>{i18n.t('checklistManager.create.title')}</Text>
          <Text style={checklistsHomeStyles.creationCard.subtitle}>{i18n.t('checklistManager.create.subtitle')}</Text>

          <TextInput
            value={newChecklistTitle}
            onChangeText={setNewChecklistTitle}
            placeholder={i18n.t('checklistManager.create.titlePlaceholder')}
            placeholderTextColor={app_colors.white_sixty}
            style={checklistsHomeStyles.creationCard.input}
          />
          <TextInput
            value={newChecklistDescription}
            onChangeText={setNewChecklistDescription}
            placeholder={i18n.t('checklistManager.create.descriptionPlaceholder')}
            placeholderTextColor={app_colors.white_sixty}
            style={checklistsHomeStyles.creationCard.input}
          />

          <View style={{ marginTop: 10 }}>
            <SimpleButton
              text={i18n.t('checklistManager.create.action')}
              icon={require('../../../assets/icons/FiPlus.png')}
              onPress={handleAddChecklist}
              fullWidth
              align="center"
              textColor={app_colors.black}
              iconColor={app_colors.black}
              backgroundColor={app_colors.white}
            />
          </View>
        </View>

        {loading ? (
          <Text style={checklistsHomeStyles.loading}>{i18n.t('common.loadings.simple')}</Text>
        ) : checklists.length === 0 ? (
          <ScreenInfo
            image={require('../../../assets/icons/FiFileText.png')}
            text={i18n.t('checklistManager.empty')}
          />
        ) : (
          checklists.map(renderChecklist)
        )}
      </ScrollView>
    </View>
  )
}

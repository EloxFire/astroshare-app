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
import AsyncStorage from "@react-native-async-storage/async-storage"

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
      <TouchableOpacity onPress={() => toggleChecklist(checklist.id)} key={checklist.id} style={checklistsHomeStyles.card} activeOpacity={0.6}>
        <View style={checklistsHomeStyles.card.header}>
          <View style={checklistsHomeStyles.card.header.meta}>
            <Text style={checklistsHomeStyles.card.header.meta.title}>{checklist.title}</Text>
            {checklist.description ? (
              <Text style={checklistsHomeStyles.card.header.meta.description}>{checklist.description}</Text>
            ) : null}
            <Text style={checklistsHomeStyles.card.header.meta.progress}>
              {i18n.t('checklistManager.checklist.progress', { done: completedCount, total: checklist.items.length })}
            </Text>
          </View>
          <View style={checklistsHomeStyles.card.header.actions}>
            <TouchableOpacity
              onPress={() => handleDeleteChecklist(checklist.id)}
              style={checklistsHomeStyles.card.header.deleteButton}
              activeOpacity={0.6}
            >
              <Image source={require('../../../assets/icons/FiTrash.png')} style={checklistsHomeStyles.card.header.deleteButton.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {expanded && (
          <View style={checklistsHomeStyles.items}>
            {checklist.items.length === 0 ? (
              <Text style={checklistsHomeStyles.items.empty}>{i18n.t('checklistManager.checklist.empty')}</Text>
            ) : (
              checklist.items.map(item => (
                <View key={item.id} style={checklistsHomeStyles.items.row}>
                  <TouchableOpacity
                    onPress={() => handleToggleItem(checklist.id, item.id)}
                    style={[
                      checklistsHomeStyles.items.checkbox,
                      item.completed && checklistsHomeStyles.items.checkbox.completed
                    ]}
                    activeOpacity={0.7}
                  >
                    {item.completed && (
                      <Image
                        source={require('../../../assets/icons/FiCheck.png')}
                        style={checklistsHomeStyles.items.checkbox.icon}
                      />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={[
                      checklistsHomeStyles.items.text,
                      item.completed && checklistsHomeStyles.items.text.completed
                    ]}
                    numberOfLines={2}
                  >
                    {item.text}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteItem(checklist.id, item.id)}
                    style={checklistsHomeStyles.items.remove}
                    activeOpacity={0.6}
                  >
                    <Image source={require('../../../assets/icons/FiXCircle.png')} style={checklistsHomeStyles.items.remove.icon} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {expanded && (
          <View style={checklistsHomeStyles.addItem}>
            <InputWithIcon
              value={newItemInputs[checklist.id] || ''}
              changeEvent={text => setNewItemInputs(prev => ({ ...prev, [checklist.id]: text }))}
              placeholder={i18n.t('checklistManager.checklist.addItemPlaceholder')}
              type="text"
              search={() => handleAddItem(checklist.id)}
            />
            <SimpleButton
              small
              text={i18n.t('checklistManager.checklist.addItem')}
              icon={require('../../../assets/icons/FiPlus.png')}
              onPress={() => handleAddItem(checklist.id)}
              fullWidth
              align="center"
              textColor={app_colors.black}
              iconColor={app_colors.black}
              backgroundColor={app_colors.white}
            />
          </View>
        )}
      </TouchableOpacity>
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

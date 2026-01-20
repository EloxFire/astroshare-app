import { Image, Text, TouchableOpacity, View } from "react-native"
import { i18n } from "../../helpers/scripts/i18n"
import { checklistsHomeStyles } from "../../styles/screens/checklists/home"
import InputWithIcon from "../forms/InputWithIcon"
import SimpleButton from "../commons/buttons/SimpleButton"
import { app_colors } from "../../helpers/constants"

interface ChecklistComponentProps {
  checklist: {
    id: string
    title: string
    description?: string
    items: { id: string; text: string; completed: boolean }[]
  }
  completedCount: number
  expanded: boolean
  onToggleExpand: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: {
    handleAddItem: (checklistId: string) => void
    handleDeleteItem: (checklistId: string, itemId: string) => void
    handleToggleItem: (checklistId: string, itemId: string) => void
    newItemInput: string
    setNewItemInput: (text: string) => void
  }
}

export const ChecklistComponent = ({ checklist, completedCount, expanded, onToggleExpand, onDelete, onUpdate }: ChecklistComponentProps) => {
  return (
    <TouchableOpacity onPress={() => onToggleExpand(checklist.id)} key={checklist.id} style={checklistsHomeStyles.card} activeOpacity={0.6}>
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
              onPress={() => onDelete(checklist.id)}
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
                    onPress={() => onUpdate.handleToggleItem(checklist.id, item.id)}
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
                    onPress={() => onUpdate.handleDeleteItem(checklist.id, item.id)}
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
              value={onUpdate.newItemInput}
              changeEvent={text => onUpdate.setNewItemInput(text)}
              placeholder={i18n.t('checklistManager.checklist.addItemPlaceholder')}
              type="text"
              search={() => onUpdate.handleAddItem(checklist.id)}
            />
            <SimpleButton
              small
              text={i18n.t('checklistManager.checklist.addItem')}
              icon={require('../../../assets/icons/FiPlus.png')}
              onPress={() => onUpdate.handleAddItem(checklist.id)}
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
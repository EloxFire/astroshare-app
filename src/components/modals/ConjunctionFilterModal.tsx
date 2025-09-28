import React from 'react'
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {conjunctionModalStyles} from "../../styles/components/modals/conjunctionModal";
import InputWithIcon from "../forms/InputWithIcon";
import {isConjunction} from "@observerly/astrometry";

interface ConjunctionFiltersModalProps {
  onClose: () => void
  onSelectPeriod: (period: {value: number, designation: string}) => void
  onSelectCustomPeriod: (from: Date, to: Date) => void
}


export default function ConjunctionFiltersModal({ onClose }: ConjunctionFiltersModalProps) {
  return (
    <View style={conjunctionModalStyles.modal}>
     <View  style={conjunctionModalStyles.modal.content}>
       <TouchableOpacity onPress={onClose} style={conjunctionModalStyles.modal.content.closeButton}>
          <Image source={require('../../../assets/icons/FiPlus.png')} style={conjunctionModalStyles.modal.content.closeButton.icon} />
       </TouchableOpacity>

       <View style={conjunctionModalStyles.modal.content.block}>
         <Text style={conjunctionModalStyles.modal.content.fieldTitle}>Sélectionnez une période</Text>
         <View style={conjunctionModalStyles.modal.content.row}>
           <TouchableOpacity style={conjunctionModalStyles.modal.content.button}>
             <Text style={conjunctionModalStyles.modal.content.button.text}>1 mois</Text>
           </TouchableOpacity>
           <TouchableOpacity style={conjunctionModalStyles.modal.content.button}>
             <Text style={conjunctionModalStyles.modal.content.button.text}>6 mois</Text>
           </TouchableOpacity>
           <TouchableOpacity style={conjunctionModalStyles.modal.content.button}>
             <Text style={conjunctionModalStyles.modal.content.button.text}>1 an</Text>
           </TouchableOpacity>
         </View>
       </View>

       <View style={conjunctionModalStyles.modal.content.block}>
         <Text style={conjunctionModalStyles.modal.content.fieldTitle}>Période personnalisée</Text>
         <View style={conjunctionModalStyles.modal.content.row}>
           <Text style={conjunctionModalStyles.modal.content.text}>Du</Text>
           <TouchableOpacity onPress={() => {}} style={conjunctionModalStyles.modal.content.datePicker}>
             <Text style={conjunctionModalStyles.modal.content.datePicker.text}>18/11/2024</Text>
           </TouchableOpacity>
           <Text style={conjunctionModalStyles.modal.content.text}>au</Text>
           <TouchableOpacity onPress={() => {}} style={conjunctionModalStyles.modal.content.datePicker}>
             <Text style={conjunctionModalStyles.modal.content.datePicker.text}>18/11/2024</Text>
           </TouchableOpacity>
         </View>
       </View>

       <View style={conjunctionModalStyles.modal.content.block}>
         <Text style={conjunctionModalStyles.modal.content.fieldTitle}>Séparation angulaire max</Text>
         <View style={conjunctionModalStyles.modal.content.row}>
           <TextInput placeholder={"3"} />
         </View>
       </View>
     </View>
    </View>
  )
}

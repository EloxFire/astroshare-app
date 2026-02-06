import { View, ScrollView, Text } from "react-native"
import PageTitle from "../../../../components/commons/PageTitle"
import { routes } from "../../../../helpers/routes"
import { i18n } from "../../../../helpers/scripts/i18n"
import { globalStyles } from "../../../../styles/global"
import InputWithIcon from "../../../../components/forms/InputWithIcon"
import { useState } from "react"
import { gearFormsStyles } from "../../../../styles/screens/profile/gear/gearForms"
import DisclaimerBar from "../../../../components/banners/DisclaimerBar"
import { Telescope } from "../../../../helpers/types/gear/Telescope"

export const AddTelescopeScreen = ({navigation}: any) => {

  
  const [telescope, setTelescope] = useState<Telescope>({
    name: "",
    aperture: 0,
    focalLength: 0,
    type: "",
    brand: "",
    model: "",
    description: "",
    usage: [],
    image_url: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('profile.gear.telescopes.addForm.title')}
        subtitle={i18n.t('profile.gear.telescopes.addForm.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <DisclaimerBar
            message="Ajouter un télescope à votre liste de matériel vous permet de profiter de fonctionnalités ultra-personnalisées, notamment le simulateur de champ de vision !"
            type="info"
            soft
          />
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Votre télescope</Text>

            <View>
              <Text style={gearFormsStyles.label}>Nom du télescope</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Mon super télescope"
                type="text"
                changeEvent={(value) => setTelescope({...telescope, name: value})}
                value={telescope.name}
                additionalStyles={{marginVertical: 5}}
              />
            </View>

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{flex: 1, marginRight: 5}}>
                <Text style={gearFormsStyles.label}>Marque</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="Omegon"
                  type="text"
                  changeEvent={(value) => setTelescope({...telescope, brand: value})}
                  value={telescope.brand}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text style={gearFormsStyles.label}>Modèle</Text>
                <InputWithIcon
                  keyboardType="default"
                  placeholder="Omegon Advanced"
                  type="text"
                  changeEvent={(value) => setTelescope({...telescope, model: value})}
                  value={telescope.model}
                  additionalStyles={{marginVertical: 5}}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>Description</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder="Description de mon super télescope"
                type="text"
                changeEvent={(value) => setTelescope({...telescope, description: value})}
                value={telescope.description}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>Caractéristiques techniques</Text>
          </View>
          {/* <View>
            <Text style={gearFormsStyles.label}>Nom du télescope</Text>
            <InputWithIcon
              keyboardType="default"
              placeholder="Mon super télescope"
              type="text"
              changeEvent={setTelescopeName}
              value={telescopeName}
              additionalStyles={{marginVertical: 5}}
            />
          </View>

          <View>
            <Text style={gearFormsStyles.label}>Ouverture du télescope (en mm)</Text>
            <InputWithIcon
              keyboardType="numeric"
              placeholder="150"
              type="number"
              changeEvent={(value) => setTelescopeAperture(Number(value))}
              value={telescopeAperture ? telescopeAperture.toString() : ""}
              additionalStyles={{marginVertical: 5}}
            />
          </View>

          <View>
            <Text style={gearFormsStyles.label}>Longueur focale du télescope (en mm)</Text>
            <InputWithIcon
              keyboardType="numeric"
              placeholder="750"
              type="number"
              changeEvent={(value) => setTelescopeFocalLength(Number(value))}
              value={telescopeFocalLength ? telescopeFocalLength.toString() : ""}
              additionalStyles={{marginVertical: 5}}
            />
          </View>

          <View>
            <Text style={gearFormsStyles.label}>Nom du télescope</Text>
            <InputWithIcon
              keyboardType="default"
              placeholder="Mon super télescope"
              type="text"
              changeEvent={setTelescopeName}
              value={telescopeName}
              additionalStyles={{marginVertical: 5}}
            />
          </View> */}
        </View>
      </ScrollView>
    </View>
  )
}
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Camera as CameraIcon, Eye as EyeIcon, LucideIcon, Layers as SetupIcon, Telescope as TelescopeIcon } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { gearName } from "../../../helpers/gear/gearName";
import { formatLocaleNumber } from "../../../helpers/format";
import { useUserDataStore } from "../../../store/userData.store";
import { useCalculationGear } from "../../../context/CalculationGearContext";
import { SelectInput, SelectOption } from "../../inputs/SelectInput/SelectInput";
import { gearSummaryBarStyles } from "./GearSummaryBar.styles";

// Ligne compacte d'un sélecteur de matériel : pastille colorée + libellé toujours visible à
// gauche du champ (voir `pickerRow` dans les styles), pour garder le repère "quelle pièce je
// choisis" même une fois une valeur sélectionnée. Une seule ligne par pièce — pensé pour rester
// lisible même si d'autres types de matériel s'ajoutent un jour (monture, filtre...).
interface GearPickerFieldProps {
  icon: LucideIcon;
  badgeColor: string;
  label: string;
  placeholder: string;
  options: SelectOption<string>[];
  value: string | null;
  onChange: (value: string) => void;
}

const GearPickerField = ({ icon: Icon, badgeColor, label, placeholder, options, value, onChange }: GearPickerFieldProps) => (
  <View style={gearSummaryBarStyles.card.editor.pickerRow}>
    <View style={[gearSummaryBarStyles.card.editor.pickerRow.badge, { backgroundColor: badgeColor }]}>
      <Icon color={app_colors.primary.main} size={12} />
    </View>
    <Text style={gearSummaryBarStyles.card.editor.pickerRow.label} numberOfLines={1}>{label}</Text>
    {/* "sheet" forcé : en "dropdown" (le défaut sous 8 options), la liste s'ouvre dans le flux de
        la page et pousse les lignes suivantes — avec beaucoup de matériel enregistré, le bandeau
        grandirait sans limite. Le panneau du bas ne dépend pas du nombre d'options. */}
    <SelectInput fill presentation="sheet" placeholder={placeholder} options={options} value={value} onChange={onChange} />
  </View>
);

// Pas de vraie "option vide" dans SelectInput (choix simple : `value` null = rien affiché, mais
// pas de ligne pour revenir à "rien" une fois un choix fait) : ce sentinel sert de première
// option de chaque liste pour pouvoir désélectionner un matériel déjà choisi.
const NONE_OPTION_VALUE = "none";

// Bandeau "Calculé avec" de l'écran Calculs : résume le matériel choisi et permet de le changer
// (3 listes dépliées sous "Changer"). Lit et écrit directement CalculationGearContext, partagé par
// l'écran principal et chaque fiche de calcul.
const GearSummaryBar = () => {
  const { t, i18n } = useTranslation("tools/astroCalculations");
  const [isEditing, setIsEditing] = useState(true);

  const telescopes = useUserDataStore((state) => state.gear.telescopes);
  const eyepieces = useUserDataStore((state) => state.gear.eyepieces);
  const cameras = useUserDataStore((state) => state.gear.cameras);
  const setups = useUserDataStore((state) => state.gear.setups);

  const { telescope, eyepiece, camera, setTelescopeId, setEyepieceId, setCameraId } = useCalculationGear();

  // Un setup regroupe potentiellement plusieurs oculaires/caméras (composition réelle d'une
  // séance) : on ne peut en retenir qu'un seul par type ici, donc le premier de chaque liste.
  const applySetup = (setupId: string) => {
    const setup = setups.find((item) => item.id === setupId);
    if (!setup) return;

    setTelescopeId(setup.scope?.id ?? null);
    setEyepieceId(setup.eyepieces[0]?.id ?? null);
    setCameraId(setup.cameras[0]?.id ?? null);
  };

  const telescopeLabel = telescope
    ? `${gearName(telescope.name, telescope.brand, telescope.model, t("gearPicker.telescope"))} ${formatLocaleNumber(telescope.aperture, i18n.language, 0)}/${formatLocaleNumber(telescope.focalLength, i18n.language, 0)}mm`
    : null;
  const eyepieceLabel = eyepiece
    ? `${t("gearPicker.eyepiece")} ${formatLocaleNumber(eyepiece.focalLength, i18n.language, 0)}mm · ${formatLocaleNumber(eyepiece.afov, i18n.language, 0)}°`
    : null;
  const cameraLabel = camera
    ? t("gearPicker.pixels", { size: formatLocaleNumber(camera.pixelSize, i18n.language, 2) })
    : null;

  const summaryText = [telescopeLabel, eyepieceLabel, cameraLabel].filter(Boolean).join(" · ") || t("screen.noGearSelected");

  return (
    <View style={gearSummaryBarStyles.card}>
      <View style={gearSummaryBarStyles.card.row}>
        <View style={gearSummaryBarStyles.card.row.iconBadge}>
          <TelescopeIcon color={app_colors.primary.main} size={18} />
        </View>

        <View style={gearSummaryBarStyles.card.row.texts}>
          <Text style={gearSummaryBarStyles.card.row.texts.eyebrow}>{t("screen.calculatedWith")}</Text>
          <Text style={gearSummaryBarStyles.card.row.texts.summary} numberOfLines={2}>{summaryText}</Text>
        </View>

        <TouchableOpacity style={gearSummaryBarStyles.card.row.changeButton} onPress={() => setIsEditing((value) => !value)}>
          <Text style={gearSummaryBarStyles.card.row.changeButton.text}>{t("screen.changeGear")}</Text>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <View style={gearSummaryBarStyles.card.editor}>
          {setups.length > 0 && (
            <>
              <GearPickerField
                icon={SetupIcon}
                badgeColor={app_colors.green.light}
                label={t("gearPicker.setup")}
                placeholder={t("gearPicker.chooseSetup")}
                options={setups.map((item) => ({ label: item.name, value: item.id }))}
                value={null}
                onChange={applySetup}
              />
              <View style={gearSummaryBarStyles.card.editor.divider} />
              <Text style={gearSummaryBarStyles.card.editor.heading}>{t("gearPicker.individualHeading")}</Text>
            </>
          )}

          <View style={gearSummaryBarStyles.card.editor.pickers}>
            <GearPickerField
              icon={TelescopeIcon}
              badgeColor={app_colors.accent.light}
              label={t("gearPicker.telescope")}
              placeholder={t("gearPicker.telescope")}
              options={[
                { label: t("gearPicker.none"), value: NONE_OPTION_VALUE },
                ...telescopes.map((item) => ({ label: gearName(item.name, item.brand, item.model, t("gearPicker.telescope")), value: item.id })),
              ]}
              value={telescope?.id ?? NONE_OPTION_VALUE}
              onChange={(value) => setTelescopeId(value === NONE_OPTION_VALUE ? null : value)}
            />
            <GearPickerField
              icon={EyeIcon}
              badgeColor={app_colors.yellow.light}
              label={t("gearPicker.eyepiece")}
              placeholder={t("gearPicker.eyepiece")}
              options={[
                { label: t("gearPicker.none"), value: NONE_OPTION_VALUE },
                ...eyepieces.map((item) => ({ label: gearName(item.name, item.brand, item.model, t("gearPicker.eyepiece")), value: item.id })),
              ]}
              value={eyepiece?.id ?? NONE_OPTION_VALUE}
              onChange={(value) => setEyepieceId(value === NONE_OPTION_VALUE ? null : value)}
            />
            <GearPickerField
              icon={CameraIcon}
              badgeColor={app_colors.white}
              label={t("gearPicker.camera")}
              placeholder={t("gearPicker.camera")}
              options={[
                { label: t("gearPicker.none"), value: NONE_OPTION_VALUE },
                ...cameras.map((item) => ({ label: gearName(item.name, item.brand, item.model, t("gearPicker.camera")), value: item.id })),
              ]}
              value={camera?.id ?? NONE_OPTION_VALUE}
              onChange={(value) => setCameraId(value === NONE_OPTION_VALUE ? null : value)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default GearSummaryBar;

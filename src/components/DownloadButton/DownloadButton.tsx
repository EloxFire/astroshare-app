import { ActivityIndicator, Text, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { Download, LucideIcon, RotateCw } from "lucide-react-native"
import { app_colors } from "../../helpers/variables"
import { RemoteFileStatus } from "../../hooks/useRemoteFile"
import { toReadableFileSize } from "../../helpers/formatFileSize"
import { downloadButtonStyles } from "./DownloadButton.styles"

interface DownloadButtonProps {
  status: RemoteFileStatus;
  progress: number;
  remoteSizeBytes: number | null;
  // Libellé et icône du bouton une fois le fichier prêt (ex. "Voir en 3D") : propres à l'usage,
  // ce composant ne connaît rien du contenu téléchargé.
  readyLabel: string;
  readyIcon: LucideIcon;
  onPress: () => void;
}

// Bouton générique pilotant l'affichage d'un téléchargement (useRemoteFile) : à télécharger,
// en cours, prêt, ou en erreur. Réutilisable pour n'importe quel type de fichier téléchargeable.
const DownloadButton = ({ status, progress, remoteSizeBytes, readyLabel, readyIcon: ReadyIcon, onPress }: DownloadButtonProps) => {
  const { t } = useTranslation("common")

  const isDisabled = status === "checking" || status === "downloading"
  const buttonStyle = [downloadButtonStyles.button, isDisabled && downloadButtonStyles.button.disabled]

  if (status === "downloading") {
    return (
      <TouchableOpacity style={buttonStyle} disabled>
        <ActivityIndicator size="small" color={app_colors.white} />
        <Text style={downloadButtonStyles.button.text}>{Math.round(progress * 100)}%</Text>
      </TouchableOpacity>
    )
  }

  if (status === "ready") {
    return (
      <TouchableOpacity style={buttonStyle} onPress={onPress}>
        <ReadyIcon size={20} color={app_colors.white} />
        <Text style={downloadButtonStyles.button.text}>{readyLabel}</Text>
      </TouchableOpacity>
    )
  }

  if (status === "error") {
    return (
      <TouchableOpacity style={buttonStyle} onPress={onPress}>
        <RotateCw size={20} color={app_colors.white} />
        <Text style={downloadButtonStyles.button.text}>{t("downloadButton.retry")}</Text>
      </TouchableOpacity>
    )
  }

  // "checking" ou "missing" : propose le téléchargement (désactivé pendant la vérification initiale)
  const sizeLabel = remoteSizeBytes === null ? null : (() => {
    const { unit, size } = toReadableFileSize(remoteSizeBytes)
    return unit === "kb" ? t("downloadButton.sizeKb", { size }) : t("downloadButton.sizeMb", { size })
  })()

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={isDisabled}>
      <Download size={20} color={app_colors.white} />
      <Text style={downloadButtonStyles.button.text}>
        {sizeLabel ? `${t("downloadButton.download")} (${sizeLabel})` : t("downloadButton.download")}
      </Text>
    </TouchableOpacity>
  )
}

export default DownloadButton

import { Text, TouchableOpacity, View } from "react-native";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { formatShortMonth } from "../../../helpers/format";
import { sessionCardStyles } from "./SessionCard.styles";

// Note maximale d'une session : chaque note s'affiche en MAX_GRADE segments.
const MAX_GRADE = 5;

export interface SessionGrade {
  // Libellé déjà traduit par l'appelant (ex: "Seeing").
  label: string;
  // Note de 0 à MAX_GRADE.
  value: number;
}

interface SessionCardProps {
  date: Date;
  // Lieu de la session (ex: "La Sinne").
  title: string;
  // Surtitre en majuscules au-dessus du lieu (ex: "Dernière session").
  label?: string;
  // Ligne de détails sous le lieu, déjà formatée par l'appelant (ex: "21:10 - 00:45 | 3h35").
  details?: string;
  // Notes de la session (ex: seeing, transparence, noirceur). Absentes : pas de ligne de notes.
  grades?: SessionGrade[];
  onPress?: () => void;
}

/**
 * <SessionCard label="Dernière session" date={session.date} title="La Sinne" details="21:10 - 00:45 | 3h35"
 *   grades={[{ label: "Seeing", value: 2 }, { label: "Transparence", value: 5 }]} onPress={…} />
 *
 * Carte d'une session d'observation du Journal : pastille de date, lieu et horaires, puis une
 * colonne par note. Ne réagit au toucher que si `onPress` est fourni.
 */
const SessionCard = ({ date, title, label, details, grades, onPress }: SessionCardProps) => {
  // Via useAppUnits (fuseau / UTC choisis par l'utilisateur) : le jour affiché doit être celui de
  // l'heure affichée partout ailleurs dans l'app.
  const { formatDate } = useAppUnits();
  const shownDate = formatDate(date);

  return (
    <TouchableOpacity
      style={sessionCardStyles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
    >
      <View style={sessionCardStyles.card.header}>
        <View style={sessionCardStyles.card.header.date}>
          <Text style={sessionCardStyles.card.header.date.day}>{shownDate.format("D")}</Text>
          <Text style={sessionCardStyles.card.header.date.month}>{formatShortMonth(shownDate)}</Text>
        </View>

        <View style={sessionCardStyles.card.header.content}>
          {label && <Text style={sessionCardStyles.card.header.content.label}>{label}</Text>}
          <Text style={sessionCardStyles.card.header.content.title}>{title}</Text>
          {details && <Text style={sessionCardStyles.card.header.content.details}>{details}</Text>}
        </View>
      </View>

      {
        grades && grades.length > 0 && (
          <View style={sessionCardStyles.card.grades}>
            {
              grades.map((grade) => (
                <View key={grade.label} style={sessionCardStyles.card.grades.gradeCard}>
                  <Text style={sessionCardStyles.card.grades.gradeCard.title}>{grade.label}</Text>

                  <View style={sessionCardStyles.card.grades.gradeCard.segments}>
                    {
                      Array.from({ length: MAX_GRADE }, (_, index) => index + 1).map((segment) => (
                        <View
                          key={segment}
                          style={[
                            sessionCardStyles.card.grades.gradeCard.segments.segment,
                            segment <= grade.value && sessionCardStyles.card.grades.gradeCard.segments.segment.active,
                          ]}
                        />
                      ))
                    }
                  </View>
                </View>
              ))
            }
          </View>
        )
      }
    </TouchableOpacity>
  );
};

export default SessionCard;

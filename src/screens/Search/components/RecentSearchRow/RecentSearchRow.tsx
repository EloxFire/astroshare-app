import { Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { recentSearchRowStyles } from "./RecentSearchRow.styles";

interface RecentSearchRowProps {
  query: string;
  onPress: () => void;
}

const RecentSearchRow = ({ query, onPress }: RecentSearchRowProps) => {
  return (
    <TouchableOpacity style={recentSearchRowStyles.row} onPress={onPress}>
      <Clock size={16} color={app_colors.primary.medium} />
      <Text style={recentSearchRowStyles.row.text}>{query}</Text>
    </TouchableOpacity>
  );
};

export default RecentSearchRow;

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type AccountHeroProps = {
  displayName: string;
};

export function AccountHero({ displayName }: AccountHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <FontAwesome6 color="#777E86" name="user" size={92} />
      </View>
      <Text style={styles.name}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 18,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#D6DADE",
    borderRadius: 80,
    height: 156,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: 156,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(18),
    marginTop: 12,
  },
});

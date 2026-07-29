import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

export function OrdersView() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ordini</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    paddingBottom: 72,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(32),
  },
});

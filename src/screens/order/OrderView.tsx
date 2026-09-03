import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { ContentCard } from "@/components/ContentCard";
import { SearchField } from "@/components/SearchField";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { category } from "@/types/category";
import { resolveApiImageUrl } from "@/utils/resolveApiImageUrl";
import { responsiveFontSize } from "@/utils/responsiveFontSize";
import { SafeAreaView } from "react-native-safe-area-context";

const crown = require("@/assets/images/corona.svg");

type OrderViewProps = {
  onCartPress?: () => void;
  onSuggestionPress: (id: number) => void;
  categories: category[];
};

export function OrderView({
  onCartPress,
  onSuggestionPress,
  categories,
}: OrderViewProps) {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <AppHeader onCartPress={onCartPress} subtitle="Lorem ipsum" />

        <View style={styles.content}>
          <View style={styles.heroTitle}>
            <Text style={styles.title}>Benvenuto Stordo!</Text>
            <Image
              accessibilityLabel="Corona Burger Queen"
              contentFit="contain"
              source={crown}
              style={styles.titleIcon}
            />
          </View>

          <Text style={styles.helper}>
            Sai già cosa prendere?{" "}
            <Text style={styles.helperStrong}>Cerca qui</Text>
          </Text>

          <SearchField
            onChangeText={setQuery}
            placeholder="Stordo, Merecano..."
            value={query}
          />

          <Text style={styles.sectionTitle}>
            Fatti trasportare dalla{" "}
            <Text style={styles.sectionAccent}>golosità</Text>
          </Text>
          <View style={styles.divider} />

          <View style={styles.cards}>
            {categories.map((item) => (
              <ContentCard
                image={
                  item.img_url
                    ? { uri: resolveApiImageUrl(item.img_url) ?? item.img_url }
                    : undefined
                }
                key={item.id}
                onPress={() => onSuggestionPress(item.id)}
                subtitle="Vai ora"
                title={item.name}
              />
            ))}
            {categories.length === 0 ? (
              <Text style={styles.empty}>Nessun risultato trovato.</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  page: {
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroTitle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  title: {
    color: colors.title,
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(35),
    letterSpacing: 0.3,
  },
  titleIcon: {
    height: 60,
    width: 60,
  },
  helper: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(17),
    marginBottom: 20,
  },
  helperStrong: {
    fontFamily: fonts.bold,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(30),
    marginTop: 32,
  },
  sectionAccent: {
    color: colors.title,
    fontFamily: fonts.regular,
  },
  divider: {
    backgroundColor: colors.textMuted,
    height: 1,
    marginBottom: 24,
    marginTop: 8,
  },
  cards: {
    gap: 20,
  },
  empty: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    paddingVertical: 28,
    textAlign: "center",
  },
});

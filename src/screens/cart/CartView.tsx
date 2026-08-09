import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { CartItem } from "@/types/cart";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { CartItemCard } from "./components/CartItemCard";

const availableTimes = ["12:00", "12:30", "13:00", "13:30", "14:00"];

type CartViewProps = {
  items: CartItem[];
  onBack: () => void;
  onConfirm: () => void;
  onDecrease: (itemId: number) => void;
  onIncrease: (itemId: number) => void;
  onRemove: (itemId: number) => void;
  onSelectTime: (time: string) => void;
  selectedTime: string | null;
  total: number;
};

export function CartView({
  items,
  onBack,
  onConfirm,
  onDecrease,
  onIncrease,
  onRemove,
  onSelectTime,
  selectedTime,
  total,
}: CartViewProps) {
  const insets = useSafeAreaInsets();
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const formattedTotal = Number.isInteger(total)
    ? total.toFixed(0)
    : total.toFixed(2);

  return (
    <View style={styles.page}>
      <AppHeader showCart={false} subtitle="Lorem ipsum" />

      <View style={styles.heading}>
        <Pressable
          accessibilityLabel="Torna indietro"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <FontAwesome6 color={colors.text} name="chevron-left" size={17} />
        </Pressable>
        <Text style={styles.title}>Carrello</Text>
      </View>
      <View style={styles.divider} />

      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FontAwesome6
              color={colors.textMuted}
              name="basket-shopping"
              size={42}
            />
            <Text style={styles.emptyText}>Il carrello è vuoto.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onDecrease={() => onDecrease(item.id)}
            onIncrease={() => onIncrease(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.summary,
          { paddingBottom: Math.max(insets.bottom + 12, 20) },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Totale:</Text>
          <Text style={styles.totalValue}>€ {formattedTotal}</Text>
        </View>

        <Pressable
          accessibilityLabel="Seleziona un orario"
          accessibilityRole="button"
          onPress={() => setIsTimePickerOpen(true)}
          style={({ pressed }) => [
            styles.timeSelector,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={selectedTime ? styles.timeValue : styles.timePlaceholder}
          >
            {selectedTime ?? "Seleziona un orario..."}
          </Text>
          <FontAwesome6 color={colors.textMuted} name="caret-down" size={14} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={items.length === 0}
          onPress={onConfirm}
          style={({ pressed }) => [
            styles.confirmButton,
            items.length === 0 && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.confirmText}>Conferma Ordine</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsTimePickerOpen(false)}
        transparent
        visible={isTimePickerOpen}
      >
        <Pressable
          accessibilityLabel="Chiudi selezione orario"
          accessibilityRole="button"
          onPress={() => setIsTimePickerOpen(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.timeMenu}>
            <Text style={styles.timeMenuTitle}>Seleziona un orario</Text>
            {availableTimes.map((time) => (
              <Pressable
                accessibilityRole="button"
                key={time}
                onPress={() => {
                  onSelectTime(time);
                  setIsTimePickerOpen(false);
                }}
                style={({ pressed }) => [
                  styles.timeOption,
                  selectedTime === time && styles.selectedTimeOption,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.timeOptionText}>{time}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flex: 1,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.title,
    borderRadius: 16,
    elevation: 2,
    height: 32,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    width: 32,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(30),
  },
  divider: {
    backgroundColor: colors.textMuted,
    height: 1,
    marginHorizontal: 16,
    marginTop: 10,
  },
  list: {
    flexGrow: 1,
    gap: 14,
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    minHeight: 180,
  },
  emptyText: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(17),
  },
  summary: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderTopWidth: 1,
    elevation: 7,
    paddingHorizontal: 70,
    paddingTop: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  totalRow: {
    alignItems: "center",
    borderBottomColor: colors.text,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 3,
    paddingHorizontal: 4,
  },
  totalLabel: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(18),
  },
  totalValue: {
    color: colors.title,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(29),
  },
  timeSelector: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    height: 44,
    justifyContent: "space-between",
    marginTop: 18,
    paddingHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  timePlaceholder: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(14),
  },
  timeValue: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(15),
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.title,
    borderRadius: 22,
    elevation: 2,
    height: 44,
    justifyContent: "center",
    marginTop: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(16),
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  timeMenu: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    maxWidth: 360,
    padding: 18,
    width: "100%",
  },
  timeMenuTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(20),
    marginBottom: 10,
  },
  timeOption: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectedTimeOption: {
    backgroundColor: colors.title,
  },
  timeOptionText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(17),
  },
  pressed: {
    opacity: 0.7,
  },
});

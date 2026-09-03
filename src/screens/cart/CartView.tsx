import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { SelectField } from "@/components/SelectField";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { CartItem } from "@/types/cart";
import type { CheckoutOption } from "@/types/checkout";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { CartItemCard } from "./components/CartItemCard";

const crown = require("@/assets/images/corona.svg");

type CartViewProps = {
  actionError: string | null;
  availableHours: CheckoutOption[];
  error: string | null;
  isCheckoutLoading: boolean;
  isLoading: boolean;
  isPhoneVerificationVisible: boolean;
  isSubmitting: boolean;
  items: CartItem[];
  onBack: () => void;
  onClosePhoneVerification: () => void;
  onConfirm: () => void;
  onDecrease: (itemId: number) => void;
  onIncrease: (itemId: number) => void;
  onProceedPhoneVerification: () => void;
  onRemove: (itemId: number) => void;
  onRetry: () => void;
  onSelectTime: (timeId: number) => void;
  onSelectType: (typeId: number) => void;
  orderTypes: CheckoutOption[];
  selectedTimeId: number | null;
  selectedTypeId: number | null;
  total: number;
  updatingItemIds: ReadonlySet<number>;
};

export function CartView(props: CartViewProps) {
  const {
    actionError,
    availableHours,
    error,
    isCheckoutLoading,
    isLoading,
    isPhoneVerificationVisible,
    isSubmitting,
    items,
    onBack,
    onClosePhoneVerification,
    onConfirm,
    onDecrease,
    onIncrease,
    onProceedPhoneVerification,
    onRemove,
    onRetry,
    onSelectTime,
    onSelectType,
    orderTypes,
    selectedTimeId,
    selectedTypeId,
    total,
    updatingItemIds,
  } = props;
  const insets = useSafeAreaInsets();
  const formattedTotal = total.toFixed(2).replace(".", ",");
  const canConfirm =
    items.length > 0 &&
    selectedTypeId !== null &&
    selectedTimeId !== null &&
    !isSubmitting;

  return (
    <View style={styles.page}>
      <SafeAreaView edges={["top", "right", "left"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerSide}>
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
              <FontAwesome6
                color={colors.background}
                name="chevron-left"
                size={16}
              />
            </Pressable>
          </View>

          <Text style={styles.title}>Carrello</Text>

          <View style={[styles.headerSide, styles.headerSideRight]}>
            <Image
              accessibilityLabel="Burger Queen"
              contentFit="contain"
              source={crown}
              style={styles.crown}
            />
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          actionError ? (
            <Text accessibilityRole="alert" style={styles.actionError}>
              {actionError}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator color={colors.title} size="large" />
            ) : error ? (
              <>
                <Text accessibilityRole="alert" style={styles.errorText}>
                  {error}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={onRetry}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>Riprova</Text>
                </Pressable>
              </>
            ) : (
              <>
                <FontAwesome6
                  color={colors.textMuted}
                  name="basket-shopping"
                  size={42}
                />
                <Text style={styles.emptyText}>Il carrello è vuoto.</Text>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <CartItemCard
            isUpdating={updatingItemIds.has(item.id)}
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

        <View style={styles.selectorsRow}>
          <View style={styles.selectorColumn}>
            <Text style={styles.selectorLabel}>Modalità di consegna</Text>
            <SelectField
              accessibilityLabel="Seleziona la modalità di consegna"
              dialogTitle="Modalità di consegna"
              disabled={isLoading || orderTypes.length === 0}
              isLoading={isLoading}
              onValueChange={onSelectType}
              options={orderTypes}
              placeholder="Seleziona una modalità..."
              value={selectedTypeId}
            />
          </View>

          <View style={styles.selectorColumn}>
            <Text style={styles.selectorLabel}>Orario</Text>
            <SelectField
              accessibilityLabel="Seleziona un orario"
              dialogTitle="Seleziona un orario"
              disabled={
                selectedTypeId === null ||
                isCheckoutLoading ||
                availableHours.length === 0
              }
              isLoading={isCheckoutLoading}
              onValueChange={onSelectTime}
              options={availableHours}
              placeholder={
                selectedTypeId === null
                  ? "Seleziona prima la modalità..."
                  : availableHours.length === 0 && !isCheckoutLoading
                    ? "Nessun orario disponibile"
                    : "Seleziona un orario..."
              }
              value={selectedTimeId}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!canConfirm}
          onPress={onConfirm}
          style={({ pressed }) => [
            styles.confirmButton,
            !canConfirm && styles.disabledButton,
            pressed && styles.pressed,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.confirmText}>Conferma Ordine</Text>
          )}
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={onClosePhoneVerification}
        transparent
        visible={isPhoneVerificationVisible}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Verifica il numero</Text>
            <Text style={styles.modalMessage}>
              Per confermare l’ordine devi prima verificare il tuo numero di
              telefono tramite il codice OTP.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={onClosePhoneVerification}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryText}>Annulla</Text>
              </Pressable>
              <Pressable
                onPress={onProceedPhoneVerification}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryText}>Procedi</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  header: {
    backgroundColor: colors.tabBar,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    zIndex: 1,
  },
  headerContent: {
    alignItems: "center",
    flexDirection: "row",
    height: 58,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerSide: {
    alignItems: "flex-start",
    flex: 1,
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(23),
    textAlign: "center",
  },
  crown: {
    height: 34,
    width: 34,
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
  actionError: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    marginBottom: 4,
    textAlign: "center",
  },
  errorText: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.title,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  retryText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(16),
  },
  summary: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderTopWidth: 1,
    elevation: 7,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  totalRow: {
    alignItems: "center",
    borderBottomColor: colors.text,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 3,
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
  selectorLabel: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(14),
    marginBottom: 6,
  },
  selectorColumn: {
    flex: 1,
    minWidth: 0,
  },
  selectorsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.title,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    marginTop: 18,
  },
  disabledButton: { opacity: 0.5 },
  confirmText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(16),
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    maxWidth: 380,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(21),
    marginBottom: 10,
  },
  modalMessage: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: colors.title,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  primaryText: { color: colors.text, fontFamily: fonts.bold },
  secondaryButton: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  secondaryText: { color: colors.text, fontFamily: fonts.semiBold },
  pressed: { opacity: 0.72 },
});

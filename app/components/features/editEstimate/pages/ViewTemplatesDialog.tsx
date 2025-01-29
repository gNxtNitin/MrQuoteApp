import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "@/app/components/providers/ThemeProvider";

interface ViewTemplatesDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: string) => void;
}

type TabType = "my" | "shared";

export function ViewTemplatesDialog({
  visible,
  onClose,
  onSelect,
}: ViewTemplatesDialogProps) {
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.textSecondary }]}>
                Saved templates
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons
                name="close"
                size={24}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "my" && styles.activeTab]}
              onPress={() => setActiveTab("my")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.textSecondary },
                  activeTab === "my" && styles.activeTabText,
                ]}
              >
                My Layout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "shared" && styles.activeTab]}
              onPress={() => setActiveTab("shared")}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.textSecondary },
                  activeTab === "shared" && styles.activeTabText,
                ]}
              >
                Shared Layout
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={Colors.gray[400]} />
            <TextInput
              style={[styles.searchInput, { color: theme.textSecondary }]}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.placeholder}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.noRecords}>No matching records found.</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.closeBtn, { borderColor: theme.textPrimary }]}
              onPress={onClose}
            >
              <Text style={[styles.closeBtnText, { color: theme.textPrimary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  container: {
    borderRadius: 16,
    width: "100%",
    maxWidth: 600,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[500],
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecords: {
    fontSize: 16,
    color: Colors.gray[400],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  closeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

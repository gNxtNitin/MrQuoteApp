import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  GestureResponderEvent,
  SectionList,
} from "react-native";
import { Card } from "../../../common/Card";
import { Input } from "../../../common/Input";
import { Colors } from "@/app/constants/colors";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Button } from "../../../common/Button";
import Slider from "@react-native-community/slider";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { ViewTemplatesDialog } from "./ViewTemplatesDialog";
import { flattenObject } from "@/app/utils/flattenObj";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { useEstimateStore } from "@/app/stores/estimateStore";
import { showToast } from "@/app/utils/ToastService";

interface LineItem {
  id: string;
  item: string;
  quantity: string;
  price: string;
}

interface ProductSelection {
  id: string;
  item: string;
  selection: string;
}

interface Signer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function AuthorizePage() {
  const theme = useTheme();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Authorize");
  const [disclaimer, setDisclaimer] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const { selectedPageId } = useEstimateStore();
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      item: "Labor",
      quantity: "1",
      price: "0",
    },
  ]);
  const [profitMargin, setProfitMargin] = useState(0);
  const [productSelections, setProductSelections] = useState<
    ProductSelection[]
  >([
    { id: "1", item: "", selection: "" },
    { id: "2", item: "", selection: "" },
    { id: "3", item: "", selection: "" },
  ]);
  const [isEditingProductTitle, setIsEditingProductTitle] = useState(false);
  const [productTitle, setProductTitle] = useState("My Product Selections");
  const [signers, setSigners] = useState<Signer[]>([
    { id: "1", firstName: "", lastName: "", email: "" },
  ]);
  const [isEditingFooterTitle, setIsEditingFooterTitle] = useState(false);
  const [footerTitle, setFooterTitle] = useState("Footer notes");
  const [footerNote, setFooterNote] = useState("");
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

  const handleAddItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        item: "",
        quantity: "",
        price: "",
      },
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateLineTotal = (quantity: string, price: string) => {
    const numQuantity = parseFloat(quantity) || 0;
    const numPrice = parseFloat(price) || 0;
    return (numQuantity * numPrice).toFixed(2);
  };

  const handleViewTemplates = () => {
    setShowTemplatesDialog(true);
  };

  const handleCloseTemplatesDialog = () => {
    setShowTemplatesDialog(false);
  };

  const handleSelectTemplate = (template: string) => {
    // console.log.log("Selected template:", template);
    setShowTemplatesDialog(false);
  };

  const handleAddSigner = () => {
    setSigners([
      ...signers,
      { id: Date.now().toString(), firstName: "", lastName: "", email: "" },
    ]);
  };

  const handleDeleteSigner = (id: string) => {
    setSigners(signers.filter((signer) => signer.id !== id));
  };

  const handleSave = () => {
    const authorizeData = {
      title,
      disclaimer,
      sectionTitle,
      lineItems,
      profitMargin,
      productSelections,
      productTitle,
      signers,
      footerTitle,
      footerNote,
    };
    const flattenedData = flattenObject(authorizeData);
    // console.log.log("Saving changes...", flattenedData);
    useEstimatePageStore
      .getState()
      .setFormData("Authorize Page", flattenedData);
    showToast("success", "Data updated successfully.");
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<LineItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.tableRow, isActive && styles.draggingRow]}
        >
          <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
            <Feather name="menu" size={16} color={theme.placeholder} />
          </TouchableOpacity>

          <TextInput
            style={[styles.cell, { color: theme.textPrimary }, styles.itemCell]}
            value={item.item}
            onChangeText={(value) => updateLineItem(item.id, "item", value)}
            placeholder="Enter item"
            placeholderTextColor={theme.placeholder}
          />
          <TextInput
            style={[
              styles.cell,
              { color: theme.textSecondary },
              styles.numberCell,
            ]}
            value={item.quantity}
            onChangeText={(value) => updateLineItem(item.id, "quantity", value)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={theme.placeholder}
          />
          <TextInput
            style={[
              styles.cell,
              { color: theme.textSecondary },
              styles.numberCell,
            ]}
            value={item.price}
            onChangeText={(value) => updateLineItem(item.id, "price", value)}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={theme.placeholder}
          />
          <View style={[styles.cell, styles.numberCell, styles.lineTotalCell]}>
            <Text
              style={[styles.lineTotalText, { color: theme.textSecondary }]}
            >
              ${calculateLineTotal(item.quantity, item.price)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteCell}
            onPress={() => handleDeleteItem(item.id)}
          >
            <Feather name="trash-2" size={16} color={Colors.red[500]} />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const sections = [
    {
      title: "main",
      data: [{}], // We only need one item since we're rendering custom content
      renderItem: () => (
        <>
          <View style={[styles.section, styles.titleContainer]}>
            <View style={styles.titleRow}>
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChangeText={setTitle}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  style={[styles.titleInput]}
                />
              ) : (
                <>
                  <Text
                    style={[styles.titleText, { color: theme.textSecondary }]}
                  >
                    {title}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Feather
                      name="edit-2"
                      size={16}
                      color={theme.textPrimary}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <Text
              style={[
                styles.savedTemplatesText,
                { color: theme.textSecondary },
              ]}
            >
              Edit the estimate details below. You can store them for use in
              subsequent reports.
            </Text>
            <View style={styles.templatesRow}>
              <Text
                style={[
                  styles.savedTemplatesText,
                  { color: theme.textSecondary },
                ]}
              >
                You have saved templates.
              </Text>
              <TouchableOpacity onPress={handleViewTemplates}>
                <Text style={[styles.link, { color: theme.textPrimary }]}>
                  View templates
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, styles.disclaimerContainer]}>
            <View style={styles.disclaimerHeader}>
              <Text
                style={[styles.disclaimerTitle, { color: theme.textSecondary }]}
              >
                Disclaimer
              </Text>
              <Text
                style={[
                  styles.disclaimerSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                For example, the terms of an estimate, or a direction to the
                insurer.
              </Text>
            </View>
            <TextInput
              style={styles.disclaimerInput}
              placeholder="Enter disclaimer text..."
              placeholderTextColor={theme.placeholder}
              value={disclaimer}
              onChangeText={setDisclaimer}
            />
          </View>

          <View style={[styles.section, styles.sectionContainer]}>
            <Text
              style={[styles.sectionHeading, { color: theme.textSecondary }]}
            >
              Section Title
            </Text>
            <TextInput
              style={styles.sectionTitleInput}
              placeholder="Enter section title"
              placeholderTextColor={theme.placeholder}
              value={sectionTitle}
              onChangeText={setSectionTitle}
            />

            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <View style={styles.dragHandle} />
                <Text
                  style={[
                    styles.headerCell,
                    { color: theme.textSecondary },
                    styles.itemCell,
                  ]}
                >
                  Item
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    { color: theme.textSecondary },
                    styles.numberCell,
                  ]}
                >
                  Quantity
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    { color: theme.textSecondary },
                    styles.numberCell,
                  ]}
                >
                  Price
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    { color: theme.textSecondary },
                    styles.numberCell,
                  ]}
                >
                  Line Total
                </Text>
                <View style={styles.deleteCell} />
              </View>

              <DraggableFlatList
                data={lineItems}
                onDragEnd={({ data }) => setLineItems(data)}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.addButtonContainer}>
              <Button
                label="Add Item"
                onPress={handleAddItem}
                icon="add"
                variant="outline"
                size="medium"
              />
            </View>
            <View style={styles.divider} />

            <View style={styles.profitMarginSection}>
              <Text
                style={[
                  styles.profitMarginTitle,
                  { color: theme.textSecondary },
                ]}
              >
                Profit margin for this quote
              </Text>
              <View style={styles.profitMarginContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={profitMargin}
                  onValueChange={setProfitMargin}
                  minimumTrackTintColor={Colors.primary[500]}
                  maximumTrackTintColor={Colors.gray[200]}
                  thumbTintColor={Colors.primary[500]}
                />
                <View style={styles.profitMarginValue}>
                  <Text
                    style={[
                      styles.profitMarginNumber,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {Math.round(profitMargin)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  /* Handle calculation info */
                }}
              >
                <Text
                  style={[styles.calculationLink, { color: theme.placeholder }]}
                >
                  How is this calculated?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, styles.productSelectionsSection]}>
            <View style={styles.sectionTitleRow}>
              {isEditingProductTitle ? (
                <Input
                  value={productTitle}
                  onChangeText={setProductTitle}
                  onBlur={() => setIsEditingProductTitle(false)}
                  autoFocus
                  style={styles.productTitleInput}
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.sectionHeading,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {productTitle}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsEditingProductTitle(true)}
                  >
                    <Feather
                      name="edit-2"
                      size={16}
                      color={theme.textPrimary}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Text
              style={[
                styles.productSelectionsSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              Use this section to request project or product details on your
              authorization page.
            </Text>

            <View style={styles.productSelectionHeaders}>
              <Text
                style={[
                  styles.productHeaderText,
                  { color: theme.textSecondary },
                ]}
              >
                Item
              </Text>
              <Text
                style={[
                  styles.productHeaderText,
                  { color: theme.textSecondary },
                ]}
              >
                Selection
              </Text>
            </View>

            {productSelections.map((selection) => (
              <View key={selection.id} style={styles.productSelectionRow}>
                <TextInput
                  style={[
                    styles.productInput,
                    { color: theme.textSecondary },
                    styles.itemInput,
                  ]}
                  placeholder="Ex: Shingle color, etc"
                  placeholderTextColor={theme.placeholder}
                  value={selection.item}
                  onChangeText={(text) => {
                    const updated = productSelections.map((s) =>
                      s.id === selection.id ? { ...s, item: text } : s
                    );
                    setProductSelections(updated);
                  }}
                />
                <TextInput
                  style={[
                    styles.productInput,
                    { color: theme.textPrimary },
                    styles.selectionInput,
                  ]}
                  placeholder="Can be left blank"
                  placeholderTextColor={theme.placeholder}
                  value={selection.selection}
                  onChangeText={(text) => {
                    const updated = productSelections.map((s) =>
                      s.id === selection.id ? { ...s, selection: text } : s
                    );
                    setProductSelections(updated);
                  }}
                />
              </View>
            ))}
          </View>

          <View style={[styles.section, styles.signersSection]}>
            <View style={styles.signerContainer}>
              <Text
                style={[styles.signerTitle, { color: theme.textSecondary }]}
              >
                Primary signer
              </Text>
              <Text
                style={[
                  styles.productSelectionsSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Signatories can be customized within a report.
              </Text>
              <View style={styles.signerRow}>
                <View style={styles.signerField}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.textSecondary }]}
                  >
                    First name
                  </Text>
                  <TextInput
                    style={[styles.signerInput, { color: theme.textSecondary }]}
                    value={signers[0].firstName}
                    onChangeText={(text) => {
                      const updated = signers.map((s, i) =>
                        i === 0 ? { ...s, firstName: text } : s
                      );
                      setSigners(updated);
                    }}
                  />
                </View>
                <View style={styles.signerField}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.textSecondary }]}
                  >
                    Last name
                  </Text>
                  <TextInput
                    style={[styles.signerInput, { color: theme.textSecondary }]}
                    value={signers[0].lastName}
                    onChangeText={(text) => {
                      const updated = signers.map((s, i) =>
                        i === 0 ? { ...s, lastName: text } : s
                      );
                      setSigners(updated);
                    }}
                  />
                </View>
                <View style={[styles.signerField, styles.emailField]}>
                  <Text
                    style={[styles.fieldLabel, { color: theme.textSecondary }]}
                  >
                    Email address
                  </Text>
                  <TextInput
                    style={[styles.signerInput, { color: theme.textSecondary }]}
                    value={signers[0].email}
                    onChangeText={(text) => {
                      const updated = signers.map((s, i) =>
                        i === 0 ? { ...s, email: text } : s
                      );
                      setSigners(updated);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>

            {signers.slice(1).map((signer, index) => (
              <View key={signer.id} style={styles.signerContainer}>
                <Text
                  style={[styles.signerTitle, { color: theme.textSecondary }]}
                >
                  Signer {index + 2}
                </Text>
                <View style={styles.signerRow}>
                  <View style={styles.signerField}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      First name
                    </Text>
                    <TextInput
                      style={[
                        styles.signerInput,
                        { color: theme.textSecondary },
                      ]}
                      value={signer.firstName}
                      onChangeText={(text) => {
                        const updated = signers.map((s) =>
                          s.id === signer.id ? { ...s, firstName: text } : s
                        );
                        setSigners(updated);
                      }}
                    />
                  </View>
                  <View style={styles.signerField}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Last name
                    </Text>
                    <TextInput
                      style={[
                        styles.signerInput,
                        { color: theme.textSecondary },
                      ]}
                      value={signer.lastName}
                      onChangeText={(text) => {
                        const updated = signers.map((s) =>
                          s.id === signer.id ? { ...s, lastName: text } : s
                        );
                        setSigners(updated);
                      }}
                    />
                  </View>
                  <View style={[styles.signerField, styles.emailField]}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Email address
                    </Text>
                    <View style={styles.emailFieldContainer}>
                      <View style={styles.emailInputContainer}>
                        <TextInput
                          style={[
                            styles.signerInput,
                            { color: theme.textSecondary },
                            styles.emailInput,
                          ]}
                          value={signer.email}
                          onChangeText={(text) => {
                            const updated = signers.map((s) =>
                              s.id === signer.id ? { ...s, email: text } : s
                            );
                            setSigners(updated);
                          }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                        <Text style={styles.requiredText}>Required</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteSigner(signer.id)}
                      >
                        <Feather
                          name="trash-2"
                          size={16}
                          color={Colors.red[500]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.addSignerContainer}>
              <Button
                label="Add signer"
                onPress={handleAddSigner}
                variant="outline"
                size="medium"
                icon="add"
              />
            </View>
          </View>

          <View style={[styles.section, styles.footerSection]}>
            <View style={styles.sectionTitleRow}>
              {isEditingFooterTitle ? (
                <Input
                  value={footerTitle}
                  onChangeText={setFooterTitle}
                  onBlur={() => setIsEditingFooterTitle(false)}
                  autoFocus
                  style={styles.footerTitleInput}
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.sectionHeading,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {footerTitle}
                  </Text>

                  {/* <TouchableOpacity
                    onPress={() => setIsEditingFooterTitle(true)}
                  >
                    <Feather
                      name="edit-2"
                      size={16}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity> */}
                </>
              )}
            </View>

            <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>
              Note:
            </Text>
            <TextInput
              style={[styles.footerInput, { color: theme.textSecondary }]}
              value={footerNote}
              onChangeText={setFooterNote}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              label="Save Changes"
              onPress={handleSave}
              variant="primary"
              size="small"
            />
          </View>
        </>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Card style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ section }) => section.renderItem()}
          renderSectionHeader={() => null}
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          stickySectionHeadersEnabled={false}
        />
      </Card>

      <ViewTemplatesDialog
        visible={showTemplatesDialog}
        onClose={handleCloseTemplatesDialog}
        onSelect={handleSelectTemplate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // backgroundColor: "#f5f5f5",
  },
  mainCard: {
    padding: 12,
    flex: 1,
  },
  titleContainer: {
    marginBottom: 16,
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    // color: Colors.black,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  templatesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  savedTemplatesText: {
    // color: Colors.black,
    fontSize: 14,
  },
  link: {
    // color: Colors.primary,
    fontSize: 14,
  },
  disclaimerContainer: {
    marginTop: 0,
  },
  disclaimerHeader: {
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: "600",
    // color: Colors.black,
    marginBottom: 8,
  },
  disclaimerSubtitle: {
    // color: Colors.gray[500],
    fontSize: 14,
  },
  disclaimerInput: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    // backgroundColor: "white",
  },
  sectionContainer: {
    marginTop: 0,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    // color: Colors.black,
    marginBottom: 8,
  },
  sectionTitleInput: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    // backgroundColor: "white",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors.gray[200],
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: "500",
    // color: Colors.black,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  cell: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 8,
    // backgroundColor: "white",
    marginRight: 8,
  },
  itemCell: {
    flex: 2,
  },
  numberCell: {
    flex: 1,
  },
  lineTotalCell: {
    justifyContent: "center",
  },
  lineTotalText: {
    textAlign: "left",
  },
  deleteCell: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonContainer: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    width: "100%",
    marginBottom: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  profitMarginSection: {
    marginTop: 0,
    paddingTop: 0,
  },
  profitMarginTitle: {
    fontSize: 20,
    fontWeight: "600",
    // color: Colors.black,
    marginBottom: 16,
  },
  profitMarginContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  profitMarginValue: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
  },
  profitMarginNumber: {
    fontSize: 16,
    // color: Colors.black,
  },
  calculationLink: {
    // color: Colors.primary[500],
    textDecorationLine: "underline",
    fontSize: 14,
  },
  section: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  productSelectionsSection: {
    marginTop: 0,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  productSelectionsSubtitle: {
    fontSize: 14,
    // color: Colors.gray[500],
    marginBottom: 24,
  },
  productSelectionHeaders: {
    flexDirection: "row",
    marginBottom: 16,
  },
  productHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    // color: Colors.black,
    flex: 1,
  },
  productSelectionRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  productInput: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    // backgroundColor: "white",
    flex: 1,
  },
  itemInput: {
    // Additional styles specific to item input if needed
  },
  selectionInput: {
    // Additional styles specific to selection input if needed
  },
  productTitleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    height: 40,
    padding: 0,
  },
  signersSection: {
    marginTop: 0,
  },
  signerContainer: {
    marginBottom: 24,
  },
  signerTitle: {
    fontSize: 18,
    fontWeight: "600",
    // color: Colors.black,
    marginBottom: 16,
  },
  signerRow: {
    flexDirection: "row",
    gap: 16,
  },
  signerField: {
    flex: 1,
  },
  emailField: {
    flex: 2,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    // color: Colors.black,
    marginBottom: 8,
  },
  signerInput: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    // backgroundColor: "white",
  },
  emailFieldContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  emailInputContainer: {
    flex: 1,
    position: "relative",
  },
  emailInput: {
    width: "100%",
  },
  requiredText: {
    position: "absolute",
    bottom: -20,
    left: 0,
    fontSize: 12,
    color: Colors.red[500],
  },
  deleteButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    // backgroundColor: "white",
    flexShrink: 0,
  },
  addSignerContainer: {
    alignItems: "flex-start",
  },
  footerSection: {
    marginTop: 0,
  },
  footerTitleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    height: 40,
    padding: 0,
  },
  footerLabel: {
    fontSize: 16,
    // color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  footerInput: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
    // backgroundColor: "white",
    minHeight: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 24,
    marginBottom: 24,
  },
  tableContainer: {
    marginBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  draggingRow: {
    backgroundColor: Colors.gray[50],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    padding: 16,
  },
});

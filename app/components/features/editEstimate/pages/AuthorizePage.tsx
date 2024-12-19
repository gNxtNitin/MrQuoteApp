// TODO: Uncomment this code
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, GestureResponderEvent, ScrollView } from 'react-native';
// import { Card } from '../../../common/Card';
// import { Input } from '../../../common/Input';
// import { Colors } from '@/app/constants/colors';
// import { Feather } from '@expo/vector-icons';
// import { useState } from 'react';
// import { Button } from '../../../common/Button';
// import Slider from '@react-native-community/slider';
// import DraggableFlatList, { 
//   ScaleDecorator,
//   RenderItemParams,
// } from 'react-native-draggable-flatlist';

// interface LineItem {
//   id: string;
//   item: string;
//   quantity: string;
//   price: string;
// }

// interface ProductSelection {
//   id: string;
//   item: string;
//   selection: string;
// }

// interface Signer {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// export function AuthorizePage() {
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [title, setTitle] = useState('Authorize');
//   const [disclaimer, setDisclaimer] = useState('');
//   const [sectionTitle, setSectionTitle] = useState('');
//   const [lineItems, setLineItems] = useState<LineItem[]>([{
//     id: '1',
//     item: 'Labor',
//     quantity: '1',
//     price: '0'
//   }]);
//   const [profitMargin, setProfitMargin] = useState(0);
//   const [productSelections, setProductSelections] = useState<ProductSelection[]>([
//     { id: '1', item: '', selection: '' },
//     { id: '2', item: '', selection: '' },
//     { id: '3', item: '', selection: '' },
//   ]);
//   const [isEditingProductTitle, setIsEditingProductTitle] = useState(false);
//   const [productTitle, setProductTitle] = useState('My Product Selections');
//   const [signers, setSigners] = useState<Signer[]>([
//     { id: '1', firstName: '', lastName: '', email: '' },
//   ]);
//   const [isEditingFooterTitle, setIsEditingFooterTitle] = useState(false);
//   const [footerTitle, setFooterTitle] = useState('Footer notes');
//   const [footerNote, setFooterNote] = useState('');

//   const handleAddItem = () => {
//     setLineItems([
//       ...lineItems,
//       {
//         id: Date.now().toString(),
//         item: '',
//         quantity: '',
//         price: '',
//       },
//     ]);
//   };

//   const handleDeleteItem = (id: string) => {
//     setLineItems(lineItems.filter(item => item.id !== id));
//   };

//   const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
//     setLineItems(
//       lineItems.map(item =>
//         item.id === id ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   const calculateLineTotal = (quantity: string, price: string) => {
//     const numQuantity = parseFloat(quantity) || 0;
//     const numPrice = parseFloat(price) || 0;
//     return (numQuantity * numPrice).toFixed(2);
//   };

//   function handleViewTemplates(event: GestureResponderEvent): void {
//     // throw new Error('Function not implemented.');
//     console.log('Viewing templates...');
//   }

//   const handleAddSigner = () => {
//     setSigners([
//       ...signers,
//       { id: Date.now().toString(), firstName: '', lastName: '', email: '' }
//     ]);
//   };

//   const handleDeleteSigner = (id: string) => {
//     setSigners(signers.filter(signer => signer.id !== id));
//   };

//   const handleSave = () => {
//     console.log('Saving changes...');
//   };

//   const renderItem = ({ item, drag, isActive }: RenderItemParams<LineItem>) => {
//     return (
//       <ScaleDecorator>
//         <TouchableOpacity
//           onLongPress={drag}
//           disabled={isActive}
//           style={[
//             styles.tableRow,
//             isActive && styles.draggingRow
//           ]}
//         >
//           <TouchableOpacity 
//             onPressIn={drag} 
//             style={styles.dragHandle}
//           >
//             <Feather name="menu" size={16} color={Colors.gray[400]} />
//           </TouchableOpacity>
          
//           <TextInput
//             style={[styles.cell, styles.itemCell]}
//             value={item.item}
//             onChangeText={(value) => updateLineItem(item.id, 'item', value)}
//             placeholder="Enter item"
//           />
//           <TextInput
//             style={[styles.cell, styles.numberCell]}
//             value={item.quantity}
//             onChangeText={(value) => updateLineItem(item.id, 'quantity', value)}
//             keyboardType="numeric"
//             placeholder="0"
//           />
//           <TextInput
//             style={[styles.cell, styles.numberCell]}
//             value={item.price}
//             onChangeText={(value) => updateLineItem(item.id, 'price', value)}
//             keyboardType="numeric"
//             placeholder="0.00"
//           />
//           <View style={[styles.cell, styles.numberCell, styles.lineTotalCell]}>
//             <Text style={styles.lineTotalText}>
//               ${calculateLineTotal(item.quantity, item.price)}
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.deleteCell}
//             onPress={() => handleDeleteItem(item.id)}
//           >
//             <Feather name="trash-2" size={16} color={Colors.red[500]} />
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </ScaleDecorator>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Card style={styles.mainCard}>
//         <ScrollView 
//           style={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={[styles.section, styles.titleContainer]}>
//             <View style={styles.titleRow}>
//               {isEditingTitle ? (
//                 <Input
//                   value={title}
//                   onChangeText={setTitle}
//                   onBlur={() => setIsEditingTitle(false)}
//                   autoFocus
//                   style={styles.titleInput}
//                 />
//               ) : (
//                 <>
//                   <Text style={styles.titleText}>{title}</Text>
//                   <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
//                     <Feather name="edit-2" size={16} color={Colors.primary} />
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//             <Text style={styles.savedTemplatesText}>
//               Edit the estimate details below. You can store them for use in subsequent reports.
//             </Text>
//             <View style={styles.templatesRow}>
//               <Text style={styles.savedTemplatesText}>You have saved templates.</Text>
//               <TouchableOpacity onPress={handleViewTemplates}>
//                 <Text style={styles.link}>View templates</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={[styles.section, styles.disclaimerContainer]}>
//             <View style={styles.disclaimerHeader}>
//               <Text style={styles.disclaimerTitle}>Disclaimer</Text>
//               <Text style={styles.disclaimerSubtitle}>
//                 For example, the terms of an estimate, or a direction to the insurer.
//               </Text>
//             </View>
//             <TextInput
//               style={styles.disclaimerInput}
//               placeholder="Enter disclaimer text..."
//               value={disclaimer}
//               onChangeText={setDisclaimer}
//             />
//           </View>

//           <View style={[styles.section, styles.sectionContainer]}>
//             <Text style={styles.sectionHeading}>Section Title</Text>
//             <TextInput
//               style={styles.sectionTitleInput}
//               placeholder="Enter section title"
//               value={sectionTitle}
//               onChangeText={setSectionTitle}
//             />

//             <View style={styles.tableContainer}>
//               <View style={styles.tableHeader}>
//                 <View style={styles.dragHandle} />
//                 <Text style={[styles.headerCell, styles.itemCell]}>Item</Text>
//                 <Text style={[styles.headerCell, styles.numberCell]}>Quantity</Text>
//                 <Text style={[styles.headerCell, styles.numberCell]}>Price</Text>
//                 <Text style={[styles.headerCell, styles.numberCell]}>Line Total</Text>
//                 <View style={styles.deleteCell} />
//               </View>

//               <DraggableFlatList
//                 data={lineItems}
//                 onDragEnd={({ data }) => setLineItems(data)}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//               />
//             </View>

//             <View style={styles.addButtonContainer}>
//               <Button
//                 label="Add Item"
//                 onPress={handleAddItem}
//                 icon="add"
//                 variant="outline"
//                 size="medium"
//               />
//             </View>
//             <View style={styles.divider} />

//             <View style={styles.profitMarginSection}>
//               <Text style={styles.profitMarginTitle}>Profit margin for this quote</Text>
//               <View style={styles.profitMarginContainer}>
//                 <Slider
//                   style={styles.slider}
//                   minimumValue={0}
//                   maximumValue={100}
//                   value={profitMargin}
//                   onValueChange={setProfitMargin}
//                   minimumTrackTintColor={Colors.primary[500]}
//                   maximumTrackTintColor={Colors.gray[200]}
//                   thumbTintColor={Colors.primary[500]}
//                 />
//                 <View style={styles.profitMarginValue}>
//                   <Text style={styles.profitMarginNumber}>{Math.round(profitMargin)}</Text>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => {/* Handle calculation info */}}>
//                 <Text style={styles.calculationLink}>How is this calculated?</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={[styles.section, styles.productSelectionsSection]}>
//             <View style={styles.sectionTitleRow}>
//               {isEditingProductTitle ? (
//                 <Input
//                   value={productTitle}
//                   onChangeText={setProductTitle}
//                   onBlur={() => setIsEditingProductTitle(false)}
//                   autoFocus
//                   style={styles.productTitleInput}
//                 />
//               ) : (
//                 <>
//                   <Text style={styles.sectionHeading}>{productTitle}</Text>
//                   <TouchableOpacity onPress={() => setIsEditingProductTitle(true)}>
//                     <Feather name="edit-2" size={16} color={Colors.primary} />
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
            
//             <Text style={styles.productSelectionsSubtitle}>
//               Use this section to request project or product details on your authorization page.
//             </Text>

//             <View style={styles.productSelectionHeaders}>
//               <Text style={styles.productHeaderText}>Item</Text>
//               <Text style={styles.productHeaderText}>Selection</Text>
//             </View>

//             {productSelections.map((selection) => (
//               <View key={selection.id} style={styles.productSelectionRow}>
//                 <TextInput
//                   style={[styles.productInput, styles.itemInput]}
//                   placeholder="Ex: Shingle color, etc"
//                   value={selection.item}
//                   onChangeText={(text) => {
//                     const updated = productSelections.map(s => 
//                       s.id === selection.id ? { ...s, item: text } : s
//                     );
//                     setProductSelections(updated);
//                   }}
//                 />
//                 <TextInput
//                   style={[styles.productInput, styles.selectionInput]}
//                   placeholder="Can be left blank"
//                   value={selection.selection}
//                   onChangeText={(text) => {
//                     const updated = productSelections.map(s => 
//                       s.id === selection.id ? { ...s, selection: text } : s
//                     );
//                     setProductSelections(updated);
//                   }}
//                 />
//               </View>
//             ))}
//           </View>

//           <View style={[styles.section, styles.signersSection]}>
//             <View style={styles.signerContainer}>
//               <Text style={styles.signerTitle}>Primary signer</Text>
//               <View style={styles.signerRow}>
//                 <View style={styles.signerField}>
//                   <Text style={styles.fieldLabel}>First name</Text>
//                   <TextInput
//                     style={styles.signerInput}
//                     value={signers[0].firstName}
//                     onChangeText={(text) => {
//                       const updated = signers.map((s, i) => 
//                         i === 0 ? { ...s, firstName: text } : s
//                       );
//                       setSigners(updated);
//                     }}
//                   />
//                 </View>
//                 <View style={styles.signerField}>
//                   <Text style={styles.fieldLabel}>Last name</Text>
//                   <TextInput
//                     style={styles.signerInput}
//                     value={signers[0].lastName}
//                     onChangeText={(text) => {
//                       const updated = signers.map((s, i) => 
//                         i === 0 ? { ...s, lastName: text } : s
//                       );
//                       setSigners(updated);
//                     }}
//                   />
//                 </View>
//                 <View style={[styles.signerField, styles.emailField]}>
//                   <Text style={styles.fieldLabel}>Email address</Text>
//                   <TextInput
//                     style={styles.signerInput}
//                     value={signers[0].email}
//                     onChangeText={(text) => {
//                       const updated = signers.map((s, i) => 
//                         i === 0 ? { ...s, email: text } : s
//                       );
//                       setSigners(updated);
//                     }}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                 </View>
//               </View>
//             </View>

//             {signers.slice(1).map((signer, index) => (
//               <View key={signer.id} style={styles.signerContainer}>
//                 <Text style={styles.signerTitle}>Signer {index + 2}</Text>
//                 <View style={styles.signerRow}>
//                   <View style={styles.signerField}>
//                     <Text style={styles.fieldLabel}>First name</Text>
//                     <TextInput
//                       style={styles.signerInput}
//                       value={signer.firstName}
//                       onChangeText={(text) => {
//                         const updated = signers.map((s) => 
//                           s.id === signer.id ? { ...s, firstName: text } : s
//                         );
//                         setSigners(updated);
//                       }}
//                     />
//                   </View>
//                   <View style={styles.signerField}>
//                     <Text style={styles.fieldLabel}>Last name</Text>
//                     <TextInput
//                       style={styles.signerInput}
//                       value={signer.lastName}
//                       onChangeText={(text) => {
//                         const updated = signers.map((s) => 
//                           s.id === signer.id ? { ...s, lastName: text } : s
//                         );
//                         setSigners(updated);
//                       }}
//                     />
//                   </View>
//                   <View style={[styles.signerField, styles.emailField]}>
//                     <Text style={styles.fieldLabel}>Email address</Text>
//                     <View style={styles.emailFieldContainer}>
//                       <View style={styles.emailInputContainer}>
//                         <TextInput
//                           style={[styles.signerInput, styles.emailInput]}
//                           value={signer.email}
//                           onChangeText={(text) => {
//                             const updated = signers.map((s) => 
//                               s.id === signer.id ? { ...s, email: text } : s
//                             );
//                             setSigners(updated);
//                           }}
//                           keyboardType="email-address"
//                           autoCapitalize="none"
//                         />
//                         <Text style={styles.requiredText}>Required</Text>
//                       </View>
//                       <TouchableOpacity 
//                         style={styles.deleteButton}
//                         onPress={() => handleDeleteSigner(signer.id)}
//                       >
//                         <Feather name="trash-2" size={16} color={Colors.red[500]} />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             ))}

//             <View style={styles.addSignerContainer}>
//               <Button
//                 label="Add signer"
//                 onPress={handleAddSigner}
//                 variant="outline"
//                 size="medium"
//                 icon="add"
//               />
//             </View>
//           </View>

//           <View style={[styles.section, styles.footerSection]}>
//             <View style={styles.sectionTitleRow}>
//               {isEditingFooterTitle ? (
//                 <Input
//                   value={footerTitle}
//                   onChangeText={setFooterTitle}
//                   onBlur={() => setIsEditingFooterTitle(false)}
//                   autoFocus
//                   style={styles.footerTitleInput}
//                 />
//               ) : (
//                 <>
//                   <Text style={styles.sectionHeading}>{footerTitle}</Text>
//                   <TouchableOpacity onPress={() => setIsEditingFooterTitle(true)}>
//                     <Feather name="edit-2" size={16} color={Colors.primary} />
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>

//             <Text style={styles.footerLabel}>Note:</Text>
//             <TextInput
//               style={styles.footerInput}
//               value={footerNote}
//               onChangeText={setFooterNote}
//               multiline
//               textAlignVertical="top"
//               numberOfLines={4}
//             />
//           </View>

//           <View style={styles.buttonContainer}>
//             <Button 
//               label="Save Changes"
//               onPress={handleSave}
//               variant="primary"
//               size="small"
//             />
//           </View>
//         </ScrollView>
//       </Card>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#f5f5f5',
//   },
//   mainCard: {
//     padding: 24,
//     flex: 1,
//   },
//   titleContainer: {
//     marginBottom: 16,
//     gap: 10,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   titleText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   titleInput: {
//     flex: 1,
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   templatesRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 20,
//   },
//   savedTemplatesText: {
//     color: Colors.black,
//   },
//   link: {
//     color: Colors.primary,
//   },
//   disclaimerContainer: {
//     marginTop: 0,
//   },
//   disclaimerHeader: {
//     marginBottom: 12,
//   },
//   disclaimerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 8,
//   },
//   disclaimerSubtitle: {
//     color: Colors.gray[500],
//     fontSize: 14,
//   },
//   disclaimerInput: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: 'white',
//   },
//   sectionContainer: {
//     marginTop: 0,
//   },
//   sectionHeading: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 8,
//   },
//   sectionTitleInput: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: 'white',
//     marginBottom: 16,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderColor: Colors.gray[200],
//     paddingBottom: 8,
//     marginBottom: 8,
//   },
//   headerCell: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.black,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//     alignItems: 'center',
//   },
//   cell: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     backgroundColor: 'white',
//     marginRight: 8,
//   },
//   itemCell: {
//     flex: 2,
//   },
//   numberCell: {
//     flex: 1,
//   },
//   lineTotalCell: {
//     justifyContent: 'center',
//   },
//   lineTotalText: {
//     textAlign: 'left',
//   },
//   deleteCell: {
//     width: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addButtonContainer: {
//     marginTop: 16,
//     marginBottom: 24,
//     alignItems: 'flex-start',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: Colors.gray[200],
//     width: '100%',
//     marginBottom: 24,
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   profitMarginSection: {
//     marginTop: 0,
//     paddingTop: 0,
//   },
//   profitMarginTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 16,
//   },
//   profitMarginContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     marginBottom: 8,
//   },
//   slider: {
//     flex: 1,
//     height: 40,
//   },
//   profitMarginValue: {
//     width: 80,
//     height: 40,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//   },
//   profitMarginNumber: {
//     fontSize: 16,
//     color: Colors.black,
//   },
//   calculationLink: {
//     color: Colors.primary[500],
//     textDecorationLine: 'underline',
//     fontSize: 14,
//   },
//   section: {
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   productSelectionsSection: {
//     marginTop: 0,
//   },
//   sectionTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   productSelectionsSubtitle: {
//     fontSize: 14,
//     color: Colors.gray[500],
//     marginBottom: 24,
//   },
//   productSelectionHeaders: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   productHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.black,
//     flex: 1,
//   },
//   productSelectionRow: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 16,
//   },
//   productInput: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: 'white',
//     flex: 1,
//   },
//   itemInput: {
//     // Additional styles specific to item input if needed
//   },
//   selectionInput: {
//     // Additional styles specific to selection input if needed
//   },
//   productTitleInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     height: 40,
//     padding: 0,
//   },
//   signersSection: {
//     marginTop: 0,
//   },
//   signerContainer: {
//     marginBottom: 24,
//   },
//   signerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: 16,
//   },
//   signerRow: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   signerField: {
//     flex: 1,
//   },
//   emailField: {
//     flex: 2,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.black,
//     marginBottom: 8,
//   },
//   signerInput: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: 'white',
//   },
//   emailFieldContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 8,
//   },
//   emailInputContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   emailInput: {
//     width: '100%',
//   },
//   requiredText: {
//     position: 'absolute',
//     bottom: -20,
//     left: 0,
//     fontSize: 12,
//     color: Colors.red[500],
//   },
//   deleteButton: {
//     height: 40,
//     width: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     backgroundColor: 'white',
//     flexShrink: 0,
//   },
//   addSignerContainer: {
//     alignItems: 'flex-start',
//   },
//   footerSection: {
//     marginTop: 0,
//   },
//   footerTitleInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     height: 40,
//     padding: 0,
//   },
//   footerLabel: {
//     fontSize: 16,
//     color: Colors.black,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   footerInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray[200],
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: 'white',
//     minHeight: 120,
//     textAlignVertical: 'top',
//   },
//   buttonContainer: {
//     alignItems: 'flex-end',
//     marginTop: 24,
//     marginBottom: 24,
//   },
//   tableContainer: {
//     marginBottom: 16,
//   },
//   dragHandle: {
//     width: 40,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   draggingRow: {
//     backgroundColor: Colors.gray[50],
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// }); 

import { View, Text, StyleSheet } from 'react-native';

export function AuthorizePage() {
  return (
    <View style={styles.container}>
      <Text>Authorize Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
}); 
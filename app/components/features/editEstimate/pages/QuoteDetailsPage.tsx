import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList } from 'react-native';
import { Card } from '../../../common/Card';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';
import { Colors } from '@/app/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { ViewTemplatesDialog } from './ViewTemplatesDialog';
import { useTheme } from '@/app/components/providers/ThemeProvider';

interface LineItem {
  id: string;
  item: string;
  quantity: string;
  price: string;
}

interface QuoteSection {
  id: string;
  title: string;
  items: LineItem[];
}

interface Quote {
  id: string;
  title: string;
  sections: QuoteSection[];
  profitMargin: number;
  notes: string;
}

interface QuoteTab {
  quote: Quote;
  isActive: boolean;
}

export function QuoteDetailsPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Quote Details');
  const [sections, setSections] = useState<QuoteSection[]>([
    {
      id: '1',
      title: '',
      items: [
        { id: '1', item: '', quantity: '', price: '' },
        { id: '2', item: '', quantity: '', price: '' }
      ]
    }
  ]);
  const [activeQuoteId, setActiveQuoteId] = useState<string>('1');
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: '1',
      title: 'Quote Details',
      sections: [
        {
          id: '1',
          title: '',
          items: [
            { id: '1', item: '', quantity: '', price: '' }
          ]
        }
      ],
      profitMargin: 0,
      notes: ''
    }
  ]);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const theme = useTheme();

  const calculateLineTotal = (quantity: string, price: string) => {
    const numQuantity = parseFloat(quantity) || 0;
    const numPrice = parseFloat(price) || 0;
    return (numQuantity * numPrice).toFixed(2);
  };

  const calculateSectionTotal = (items: LineItem[]) => {
    return items.reduce((total, item) => {
      return total + (parseFloat(calculateLineTotal(item.quantity, item.price)) || 0);
    }, 0).toFixed(2);
  };

  const calculateQuoteSubtotal = () => {
    return sections.reduce((total, section) => {
      return total + parseFloat(calculateSectionTotal(section.items));
    }, 0).toFixed(2);
  };

  const handleAddItem = (quoteId: string, sectionId: string) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        return {
          ...quote,
          sections: quote.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: [
                  ...section.items,
                  { id: Date.now().toString(), item: '', quantity: '', price: '' }
                ]
              };
            }
            return section;
          })
        };
      }
      return quote;
    }));
  };

  const handleDeleteItem = (quoteId: string, sectionId: string, itemId: string) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        return {
          ...quote,
          sections: quote.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: section.items.filter(item => item.id !== itemId)
              };
            }
            return section;
          })
        };
      }
      return quote;
    }));
  };

  const handleAddSection = (quoteId: string) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        return {
          ...quote,
          sections: [
            ...quote.sections,
            {
              id: Date.now().toString(),
              title: '',
              items: [{ id: '1', item: '', quantity: '', price: '' }]
            }
          ]
        };
      }
      return quote;
    }));
  };

  const handleDeleteSection = (quoteId: string, sectionId: string) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        return {
          ...quote,
          sections: quote.sections.filter(section => section.id !== sectionId)
        };
      }
      return quote;
    }));
  };

  const handleUpdateSection = (quoteId: string, sectionId: string, field: keyof QuoteSection, value: string) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        return {
          ...quote,
          sections: quote.sections.map(section => 
            section.id === sectionId ? { ...section, [field]: value } : section
          )
        };
      }
      return quote;
    }));
  };

  const handleUpdateLineItem = (quoteId: string, sectionId: string, itemId: string, field: keyof LineItem, value: string) => {
    setQuotes(quotes.map(quote => {
      if (quote.id === quoteId) {
        return {
          ...quote,
          sections: quote.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: section.items.map(item => 
                  item.id === itemId ? { ...item, [field]: value } : item
                )
              };
            }
            return section;
          })
        };
      }
      return quote;
    }));
  };

   const handleSave = () => {
      const quoteDetailsPageData = {
  
      };
      console.log("Saving changes...");
    };

  const renderItem = (quoteId: string, sectionId: string) => ({ item, drag, isActive }: RenderItemParams<LineItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[styles.tableRow, isActive && styles.draggingRow]}
        >
          <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
            <Feather name="menu" size={16} color={Colors.gray[400]} />
          </TouchableOpacity>
          
          <View style={[styles.cell, styles.itemCell]}>
            <TextInput
              style={styles.input}
              value={item.item}
              onChangeText={(value) => handleUpdateLineItem(quoteId, sectionId, item.id, 'item', value)}
              placeholder="Enter item"
            />
            <TouchableOpacity style={styles.addIcon}>
              <Feather name="plus" size={16} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.cell, styles.numberCell]}
            value={item.quantity}
            onChangeText={(value) => handleUpdateLineItem(quoteId, sectionId, item.id, 'quantity', value)}
            keyboardType="numeric"
            placeholder="0"
          />
          <TextInput
            style={[styles.cell, styles.numberCell]}
            value={item.price}
            onChangeText={(value) => handleUpdateLineItem(quoteId, sectionId, item.id, 'price', value)}
            keyboardType="numeric"
            placeholder="0.00"
          />
          <View style={[styles.cell, styles.numberCell]}>
            <Text>${calculateLineTotal(item.quantity, item.price)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteCell}
            onPress={() => handleDeleteItem(quoteId, sectionId, item.id)}
          >
            <Feather name="trash-2" size={16} color={Colors.red[500]} />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const handleAddQuote = () => {
    if (quotes.length >= 9) return;
    const newQuote: Quote = {
      id: Date.now().toString(),
      title: 'Quote Details',
      sections: [
        {
          id: Date.now().toString() + '-section',
          title: '',
          items: [
            { 
              id: Date.now().toString() + '-item', 
              item: '', 
              quantity: '', 
              price: '' 
            }
          ]
        }
      ],
      profitMargin: 0,
      notes: ''
    };
    setQuotes([...quotes, newQuote]);
    setActiveQuoteId(newQuote.id);
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (quotes.length <= 1) return;
    const newQuotes = quotes.filter(q => q.id !== quoteId);
    setQuotes(newQuotes);
    if (activeQuoteId === quoteId) {
      setActiveQuoteId(newQuotes[0].id);
    }
  };

  const handleUpdateQuote = (quoteId: string, field: keyof Quote, value: any) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, [field]: value } : quote
    ));
  };

  const handleViewTemplates = () => {
    setShowTemplatesDialog(true);
  };

  const handleCloseTemplatesDialog = () => {
    setShowTemplatesDialog(false);
  };

  const handleSelectTemplate = (template: string) => {
    console.log('Selected template:', template);
    setShowTemplatesDialog(false);
  };

  const renderQuoteContent = ({ item: quote }: { item: Quote }) => {
    if (quote.id !== activeQuoteId) return null;
    
    return (
      <View key={quote.id} style={styles.quoteDetailsWrapper}>
        <View style={styles.quoteDetailsHeader}>
          <Text style={styles.quoteDetailsTitle}>Quote Details</Text>
          <TouchableOpacity>
            <Feather name="edit-2" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quoteDetailsContent}>
          {quote.sections.map((section) => (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionLabel}>Section title</Text>
                  <TextInput
                    style={[styles.sectionInput, styles.titleInput]}
                    placeholder="Section title"
                    value={section.title}
                    onChangeText={(value) => handleUpdateSection(quote.id, section.id, 'title', value)}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteSection(quote.id, section.id)}
                >
                  <Feather name="trash-2" size={16} color={Colors.red[500]} />
                </TouchableOpacity>
              </View>

              <View style={styles.tableHeader}>
                <View style={styles.dragHandle} />
                <Text style={[styles.headerCell, styles.itemCell]}>Item</Text>
                <Text style={[styles.headerCell, styles.numberCell]}>Quantity</Text>
                <Text style={[styles.headerCell, styles.numberCell]}>Price</Text>
                <Text style={[styles.headerCell, styles.numberCell]}>Total</Text>
                <View style={styles.deleteCell} />
              </View>

              <DraggableFlatList
                data={section.items}
                onDragEnd={({ data }) => {
                  setQuotes(quotes.map(q => 
                    q.id === quote.id 
                      ? {
                          ...q,
                          sections: q.sections.map(s =>
                            s.id === section.id ? { ...s, items: data } : s
                          )
                        }
                      : q
                  ));
                }}
                keyExtractor={(item) => item.id}
                renderItem={renderItem(quote.id, section.id)}
              />

              <View style={styles.sectionFooter}>
                <Button
                  label="Add Item"
                  onPress={() => handleAddItem(quote.id, section.id)}
                  variant="outline"
                  size="medium"
                  icon="add"
                />
                <Text style={styles.sectionTotal}>
                  Section total: ${calculateSectionTotal(section.items)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.addSectionContainer}>
            <Button
              label="Add section"
              onPress={() => handleAddSection(quote.id)}
              variant="primary"
              size="medium"
              icon="add"
            />
          </View>

          <View style={styles.bottomRow}>
            <View style={[styles.section, styles.profitMarginSection]}>
              <Text style={styles.sectionHeader}>Profit margin for this quote</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={quote.profitMargin}
                onValueChange={(value: any) => handleUpdateQuote(quote.id, 'profitMargin', value)}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.gray[200]}
              />
              <Text style={styles.profitMarginValue}>{Math.round(quote.profitMargin)}%</Text>
            </View>

            <View style={[styles.section, styles.totalsSection]}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Quote subtotal</Text>
                <Text style={styles.totalAmount}>${calculateQuoteSubtotal()}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: 'black', fontWeight: 'bold' }]}>Total</Text>
                <Text style={styles.totalAmount}>${calculateQuoteSubtotal()}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.section, styles.notesSection]}>
            <Text style={styles.sectionHeader}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              value={quote.notes}
              onChangeText={(value) => handleUpdateQuote(quote.id, 'notes', value)}
              placeholder="Add notes here..."
              textAlignVertical="top"
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

        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={styles.mainCard}>
        <View style={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChangeText={setTitle}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  style={styles.titleInput}
                />
              ) : (
                <>
                  <Text style={styles.titleText}>{title}</Text>
                  <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Feather name="edit-2" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>
                You have saved templates.{' '}
                <Text 
                  style={styles.link}
                  onPress={handleViewTemplates}
                >
                  view templates
                </Text>
              </Text>
            </View>
          </View>

          {/* Quote Tabs */}
          <View style={styles.tabsWrapper}>
            <DraggableFlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={quotes.map(quote => ({
                quote,
                isActive: quote.id === activeQuoteId
              }))}
              onDragEnd={({ data }) => {
                setQuotes(data.map(item => item.quote));
              }}
              keyExtractor={(item) => item.quote.id}
              renderItem={({ item, drag, isActive }: RenderItemParams<QuoteTab>) => (
                <ScaleDecorator>
                  <View style={styles.tabWrapper}>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        item.isActive && styles.activeTab,
                        isActive && styles.draggingTab
                      ]}
                      onPress={() => setActiveQuoteId(item.quote.id)}
                      onLongPress={drag}
                      disabled={isActive}
                    >
                      <View style={styles.tabContent}>
                        <TouchableOpacity 
                          onPressIn={drag}
                          style={styles.dragHandle}
                        >
                          <Feather name="menu" size={16} color={Colors.gray[400]} />
                        </TouchableOpacity>
                        
                        <Text style={[
                          styles.tabText,
                          item.isActive && styles.activeTabText
                        ]}>
                          {item.quote.title}
                        </Text>

                        {quotes.length > 1 && (
                          <TouchableOpacity 
                            style={styles.closeTab}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeleteQuote(item.quote.id);
                            }}
                          >
                            <Feather name="x" size={16} color={Colors.gray[400]} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScaleDecorator>
              )}
              containerStyle={styles.tabsContainer}
            />
            
            <TouchableOpacity 
              style={[
                styles.addTab,
                quotes.length >= 9 && styles.disabledAddTab
              ]}
              onPress={handleAddQuote}
              disabled={quotes.length >= 9}
            >
              <Feather 
                name="plus" 
                size={20} 
                color={quotes.length >= 9 ? Colors.gray[400] : Colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Replace the ScrollView with FlatList */}
          <FlatList
            data={quotes}
            renderItem={renderQuoteContent}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          />

          <ViewTemplatesDialog
            visible={showTemplatesDialog}
            onClose={handleCloseTemplatesDialog}
            onSelect={handleSelectTemplate}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  mainCard: {
    padding: 24,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.black,
    fontSize: 14,
  },
  link: {
    color: Colors.primary,
    fontSize: 14,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
  },
  sectionInput: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  selectionInput: {
    // Additional styles for selection input if needed
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 8,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
  },
  dragHandle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cell: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    backgroundColor: 'white',
    marginRight: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  itemCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCell: {
    flex: 1,
  },
  input: {
    flex: 1,
  },
  addIcon: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Colors.gray[200],
  },
  deleteCell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggingRow: {
    backgroundColor: Colors.gray[50],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  sectionTotal: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalsContainer: {
    marginTop: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  addSectionContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingBottom: 1,
  },
  tabsContainer: {
    flex: 1,
    minHeight: 41,
  },
  tabWrapper: {
    marginRight: 8,
    marginBottom: -1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderBottomColor: Colors.gray[200],
    minWidth: 150,
  },
  activeTab: {
    backgroundColor: 'white',
    borderColor: Colors.primary,
    borderBottomColor: 'white',
  },
  tabText: {
    color: Colors.gray[500],
    marginRight: 8,
  },
  activeTabText: {
    color: Colors.primary,
  },
  closeTab: {
    marginLeft: 8,
  },
  addTab: {
    width: 40,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    marginLeft: 8,
  },
  disabledAddTab: {
    backgroundColor: Colors.gray[50],
    borderColor: Colors.gray[200],
    opacity: 0.7,
  },
  profitMarginSection: {
    flex: 1,
    marginBottom: 0,
  },
  slider: {
    height: 40,
    marginVertical: 8,
  },
  profitMarginValue: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    backgroundColor: 'white',
    marginTop: 8,
  },
  contentContainer: {
    flexGrow: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  totalsSection: {
    flex: 1,
    marginBottom: 0,
    justifyContent: 'center',
  },
  quoteDetailsWrapper: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 24,
  },
  quoteDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  quoteDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  quoteDetailsContent: {
    padding: 16,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabTextContainer: {
    flex: 1,
  },
  draggingTab: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
});
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';

interface Company {
  id: string;
  initial: string;
  name: string;
  color: string;
}

interface CompanySwitcherProps {
  companies: Company[];
  selectedCompany: string;
  onSelectCompany: (companyId: string) => void;
  onLogout: () => void;
}

export function CompanySwitcher({ 
  companies, 
  selectedCompany, 
  onSelectCompany, 
  onLogout 
}: CompanySwitcherProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Switch Company</Text>
      
      {companies.map((company) => (
        <Pressable
          key={company.id}
          style={styles.companyRow}
          onPress={() => onSelectCompany(company.id)}
        >
          <View style={[styles.initialCircle, { backgroundColor: company.color }]}>
            <Text style={styles.initial}>{company.initial}</Text>
          </View>
          
          <Text style={styles.companyName}>{company.name}</Text>
          
          {selectedCompany === company.id ? (
            <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
          ) : (
            <View style={styles.uncheckedCircle} />
          )}
        </Pressable>
      ))}

      <Pressable style={[styles.logoutRow, { borderTopWidth: 0 }]} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
        <MaterialIcons name="logout" size={24} color="#666" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: 300,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.black,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initial: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  companyName: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4, // Reduced from 16 to 8
    paddingTop: 6, // Reduced from 16 to 12
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 16,
    color: '#666',
  },
}); 
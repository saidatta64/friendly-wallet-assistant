
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { useApp } from '../contexts/AppContext';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const { users, totalToGet, totalToGive } = useApp();
  const [activeTab, setActiveTab] = useState('toGet');
  
  // Data for overview pie chart
  const overviewData = [
    { name: 'To Get', value: totalToGet, color: '#3b82f6', legendFontColor: '#7F7F7F' },
    { name: 'To Give', value: totalToGive, color: '#f87171', legendFontColor: '#7F7F7F' },
  ].filter(item => item.value > 0); // Only include non-zero values
  
  // Data for detailed pie charts
  const toGetData = users
    .filter(user => user.balance > 0)
    .map((user, index) => ({
      name: user.name,
      value: user.balance,
      color: getColorForIndex(index),
      legendFontColor: '#7F7F7F',
    }));
  
  const toGiveData = users
    .filter(user => user.balance < 0)
    .map((user, index) => ({
      name: user.name,
      value: Math.abs(user.balance),
      color: getColorForIndex(index),
      legendFontColor: '#7F7F7F',
    }));
  
  function getColorForIndex(index) {
    const colors = [
      '#3b82f6', '#f87171', '#10b981', '#8b5cf6', 
      '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'
    ];
    return colors[index % colors.length];
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Financial Summary</Text>
        
        <Card style={styles.card}>
          <Card.Title title="Balance Overview" subtitle="Summary of money to get and give" />
          <Card.Content>
            <View style={styles.balanceGrid}>
              <View style={styles.balanceBlock}>
                <Text style={styles.balanceLabel}>To Get</Text>
                <Text style={[styles.balanceAmount, styles.positiveAmount]}>
                  ₹{totalToGet.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceBlock}>
                <Text style={styles.balanceLabel}>To Give</Text>
                <Text style={[styles.balanceAmount, styles.negativeAmount]}>
                  ₹{totalToGive.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              {overviewData.length > 0 ? (
                <PieChart
                  data={overviewData}
                  width={screenWidth - 64}
                  height={180}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  absolute
                />
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={styles.emptyChartText}>No data to display</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Title title="Detailed Analysis" subtitle="Breakdown by contact" />
          <Card.Content>
            <View style={styles.tabContainer}>
              <Chip 
                selected={activeTab === 'toGet'} 
                onPress={() => setActiveTab('toGet')}
                style={styles.chip}
              >
                To Get
              </Chip>
              <Chip 
                selected={activeTab === 'toGive'} 
                onPress={() => setActiveTab('toGive')}
                style={styles.chip}
              >
                To Give
              </Chip>
            </View>
            
            {activeTab === 'toGet' && (
              <View style={styles.tabContent}>
                <View style={styles.chartContainer}>
                  {toGetData.length > 0 ? (
                    <PieChart
                      data={toGetData}
                      width={screenWidth - 64}
                      height={180}
                      chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="value"
                      backgroundColor="transparent"
                      paddingLeft="0"
                      absolute
                    />
                  ) : (
                    <View style={styles.emptyChart}>
                      <Text style={styles.emptyChartText}>No money to get</Text>
                    </View>
                  )}
                </View>
                
                {/* Legend for To Get */}
                {toGetData.length > 0 && (
                  <View style={styles.legendContainer}>
                    {toGetData.map((entry, index) => (
                      <View key={`legend-${index}`} style={styles.legendItem}>
                        <View 
                          style={[styles.legendColor, { backgroundColor: entry.color }]} 
                        />
                        <Text style={styles.legendText}>
                          {entry.name}: ₹{entry.value.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
            
            {activeTab === 'toGive' && (
              <View style={styles.tabContent}>
                <View style={styles.chartContainer}>
                  {toGiveData.length > 0 ? (
                    <PieChart
                      data={toGiveData}
                      width={screenWidth - 64}
                      height={180}
                      chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="value"
                      backgroundColor="transparent"
                      paddingLeft="0"
                      absolute
                    />
                  ) : (
                    <View style={styles.emptyChart}>
                      <Text style={styles.emptyChartText}>No money to give</Text>
                    </View>
                  )}
                </View>
                
                {/* Legend for To Give */}
                {toGiveData.length > 0 && (
                  <View style={styles.legendContainer}>
                    {toGiveData.map((entry, index) => (
                      <View key={`legend-${index}`} style={styles.legendItem}>
                        <View 
                          style={[styles.legendColor, { backgroundColor: entry.color }]} 
                        />
                        <Text style={styles.legendText}>
                          {entry.name}: ₹{entry.value.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  balanceGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  balanceBlock: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    margin: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#22c55e',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  tabContent: {
    marginTop: 8,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#334155',
  },
});

export default ReportsScreen;

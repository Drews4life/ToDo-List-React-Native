import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';


export default class Footer extends Component {
  render() {
    const {filter} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.filterStyle}>
          <Text style={{padding: 8}}>Active: {this.props.count}</Text>
          <TouchableOpacity
            style={[styles.eachFilter, filter === 'ALL' ? styles.selected : null]}
            onPress={() => this.props.onFilter('ALL')}>
            <Text>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eachFilter, filter === 'ACTIVE' ? styles.selected : null]}
            onPress={() => this.props.onFilter('ACTIVE')}>
            <Text>Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.eachFilter, filter === 'COMPLETED' ? styles.selected : null]}
            onPress={() => this.props.onFilter('COMPLETED')}>
            <Text>Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.eachFilter}
            onPress={this.props.onClearCompleted}>
            <Text>Clear Completed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterStyle: {
    flexDirection: 'row'
  },
  eachFilter: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selected: {
    borderColor: 'rgba(175, 47, 47, .2)'
  },
  textWrapper: {
    padding: 8
  }
});

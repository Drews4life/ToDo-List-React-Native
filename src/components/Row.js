import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  TextInput
} from 'react-native';


export default class Row extends Component {
  render() {
    const {complete, text} = this.props;
    let textComponent = (
      <TouchableOpacity
        onLongPress={() => {
          console.log('exists onPress: ' + this.props.editing);
          return this.props.onToggleEdit(true);
        }}
        style={styles.textWrapper}>
        <Text style={[styles.text, complete ? styles.complete : null]}>{text}</Text>
      </TouchableOpacity>
    );
    let removeButton = (
      <TouchableOpacity onPress={this.props.onRemove}>
        <Text style={styles.delete}>X</Text>
      </TouchableOpacity>
    );
    let editingComponent = (
      <View style={styles.textWrapper}>
        <TextInput
          autoFocus
          onChangeText={this.props.onUpdate}
          value={text}
          style={styles.input}
          multiline
          underlineColorAndroid="transparent"
          />
      </View>
    );
    let doneButton = (
      <TouchableOpacity onPress={() => this.props.onToggleEdit(false)}>
        <Text style={styles.icon}>{String.fromCharCode(10003)}</Text>
      </TouchableOpacity>
    );
    console.log('exists: ' + this.props.editing);
    return (
      <View style={styles.container}>
        <Switch
          value={this.props.complete}
          onValueChange={this.props.onComplete}
        />
      {this.props.editing ? editingComponent : textComponent}
      {this.props.editing ? doneButton : removeButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  switchWrapper: {
    flex: 1
  },
  textWrapper: {
    flex: 1,
    marginHorizontal: 10
  },
  text: {
    fontSize: 20,
    color: '#4d4d4d'
  },
  complete: {
    textDecorationLine: 'line-through'
  },
  delete: {
    fontSize: 20,
    color: '#cc9a9a'
  },
  input: {
    fontSize: 24,
    height: 100,
    flex: 1,
    padding: 0,
    color: '#4d4d4d'
  },
  icon: {
    fontSize: 30,
    color: '#CCC',
    alignSelf: 'center'
  }
});

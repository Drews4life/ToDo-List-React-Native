import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ListView,
  Keyboard,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import Row from './src/components/Row';

const filterItems = (filter, items) => {
  return items.filter(item => {
    if(filter === 'ALL') return true;
    if(filter === 'ACTIVE') return !item.complete;
    if(filter === 'COMPLETED') return item.complete;
  });
};

export default class App extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    this.state = {
      loading: true,
      value: '',
      filter: 'ALL',
      items: [],
      allComplete: false,
      dataSource: ds.cloneWithRows([])
    };

  }

  componentWillMount () {
    AsyncStorage.getItem('items').then(json => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, {loading: false});
      } catch(e) {
        this.setState({loading: false});
      }
    })
  }

  handleToggleAllComplete = () => {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map(item => ({
      ...item,
      complete
    }));
    this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete});
  };

  handleAddItem = () => {
    if(!this.state.value) return;

    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        complete: false,
        text: this.state.value
      }
    ];

    this.setSource(newItems, filterItems(this.state.filter, newItems), {value: ''});
  };

  setSource = (items, itemsDataSource, otherState = {}) => {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState
    });
    AsyncStorage.setItem('items', JSON.stringify(items));
  };

  handleToggleComplete = (key, complete) => {
   const newItems = this.state.items.map(item => {

     if(item.key !== key) {
       return item;
     }

     return {
       ...item,
       complete
     };

   });

   this.setSource(newItems, filterItems(this.state.filter, newItems));
 };



   placeholderfunc = (value, complete) => {
       itemIndex = this.state.items.findIndex(item => item.key === value.key);

       const mappedArray = this.state.items.filter(item => item.key !== value.key);
       const newState = [
         ...mappedArray,
         value: {
           completed: complete
         }
       ];
       this.setState({
         ...this.state,
         items: newState,
         dataSource: this.state.dataSource.cloneWithRows(newState)
       });

   }


  handleRemove = key => {
    const newItems = this.state.items.filter(item => item.key !== key);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };

  handleOnFilter = (filter) => {
    this.setSource(this.state.items, filterItems(filter, this.state.items), {filter});
  };

  handleOnClearCompleted = () => {
    const newItems = filterItems('ACTIVE', this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };

  handleUpdateText = (key, text) => {
    const newItems = this.state.items.map(item => {
      if(item.key !== key) return item;

      return {
        ...item,
        text
      };
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };

  handleToggleEditing = (key, editing) => {
    const newItems = this.state.items.map(item => {
      if(item.key !== key) return item;

      return {
        ...item,
        editing
      };
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };

  render() {
    let activityIndicator = null;
    if(this.state.loading) {
      activityIndicator = (
        <View style={styles.loading}>
          <ActivityIndicator
            animating
            size='large'
            />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onToggleAllComplete={this.handleToggleAllComplete}
          onChange={value => this.setState({value})}
          />
          <View style={styles.content}>
            <ListView
              style={styles.list}
              enableEmptySections
              dataSource={this.state.dataSource}
              onScroll={() => Keyboard.dismiss()}
              renderRow={(value) => {
                console.log('value: ',value);
                return (
                  <Row
                    key={value.key}
                    text={value.text}
                    complete={value.complete}
                    editing={value.editing}
                    onComplete={complete => this.handleToggleComplete(value.key, complete)}
                    onRemove={() => this.handleRemove(value.key)}
                    onUpdate={text => this.handleUpdateText(value.key, text)}
                    onToggleEdit={editing => this.handleToggleEditing(value.key, editing)}
                  />
                );
              }}
              renderSeparator={(sectionId, rowId) => {
                return <View style={styles.separator} key={rowId}/>
              }}
              />
          </View>
        <Footer
          count={filterItems('ACTIVE', this.state.items).length}
          filter={this.state.filter}
          onFilter={this.handleOnFilter}
          onClearCompleted={this.handleOnClearCompleted}
          />
        {activityIndicator}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: { paddingTop: 3 }
    })
  },
  content: {
    flex: 1,
    width: '100%',
  },
  loading: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  separator: {
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  list: {
    backgroundColor: '#FFF'
  }
});

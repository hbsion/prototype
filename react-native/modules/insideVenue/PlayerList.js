import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Button, Alert} from 'react-native'

export default class PlayerList extends React.Component {
  static propTypes = {
    players: PropTypes.array,
  }
  render() {
    const {players} = this.props
    console.log(players)
    return (
      <View style={styles.container}>
        <FlatList
          data={players}
          renderItem={this._renderItem}
          renderSeparator={this._renderSeparator}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
  _renderItem = ({item}) => (
    <MyListItem
      id={item._id}
      onPressItem={this._onPressItem}
      title={item._id}
    />
  )
  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    )
  }
  _keyExtractor = (item) => item._id
  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    console.log(id)
  }

}

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this._onPress}>
          <View>
            <Text>
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  item: {
    flex: 0.2,
  }
})

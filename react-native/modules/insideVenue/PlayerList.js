import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Button, Alert} from 'react-native'
import { Link } from 'react-router-native'

export default class PlayerList extends React.Component {
  static propTypes = {
    players:     PropTypes.array.isRequired,
  }
  render() {
    const {players} = this.props
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
    <PlayerListItem
      id={item._id}
      title={item._id}
      count={item.newMessages}
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
}

class PlayerListItem extends React.PureComponent {
  render() {
    const {id, count, title} = this.props
    return (
      <View style={styles.item}>
        <TouchableOpacity>
          <View>
            <Link to={`/player/${id}`}><Text>{title} ({count})</Text></Link>
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
    paddingTop: 20,
    paddingBottom: 20,
  }
})

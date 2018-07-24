import PropTypes    from 'prop-types'
import React        from 'react'
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Button, Alert} from 'react-native'
import { Link } from 'react-router-native'

export default class UserList extends React.Component {
  static propTypes = {
    users:     PropTypes.array.isRequired,
  }
  render() {
    const {users} = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={this._renderItem}
          renderSeparator={this._renderSeparator}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
  _renderItem = ({item}) => (
    <UserListItem
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

class UserListItem extends React.PureComponent {
  render() {
    const {id, count, title} = this.props
    return (
      <View style={styles.item}>
        <TouchableOpacity>
          <View>
            <Link to={`/user/${id}`}><Text>{title} ({count})</Text></Link>
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

import PropTypes             from 'prop-types'
import React                 from 'react'
import {View, StyleSheet, Text, Button, Modal, TouchableHighlight} from 'react-native'

export default class EnteringModal extends React.Component {

  render() {
    const { handleBackButton, isAmbassador, isOpen, setAmbassadorMode } = this.props
    return (
      <Modal
        animationType="slide"
        transparent={true}
        presentationStyle={'overFullScreen'}
        visible={isOpen}
        onRequestClose={handleBackButton}>
        <View style={styles.modal}>
          <View>
            <Text>Activer le mode ambassadeur ?</Text>
            <Button
              onPress={() => setAmbassadorMode(true)}
              title="Oui"
            />
            <Button
              onPress={() => setAmbassadorMode(false)}
              title="Non"
            />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    borderWidth: 2,
    margin: 15,
    backgroundColor: '#fff',
  },
})

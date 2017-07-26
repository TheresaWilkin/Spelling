import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Animated, Text, TouchableOpacity } from 'react-native';
import { Card, CardSection } from './common';

class Keyboard extends Component {
state = {
    text: this.props.text
}

render() {
  const { onChange } = this.props;
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  return (
    <Card>
      <CardSection>
        <Text>{this.state.text}</Text>
      </CardSection>
        <View style={styles.viewStyle}>
        {alphabet.map((letter, i) => {
          return (<TouchableOpacity key={i} onPress={() => onChange(letter)} style={styles.buttonStyle}><Text>{letter}</Text></TouchableOpacity>)
        })}
      </View>
    </Card>
  );
}

}

const styles = {
  viewStyle: {
    flexWrap: 'wrap',
    flex: 1
  },
  buttonStyle: {
    width: 10
  }
}

export default Keyboard;

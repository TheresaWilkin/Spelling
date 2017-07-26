import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Animated, TextInput } from 'react-native';
import Tts from 'react-native-tts';

import { setupWords, answerWord, replaceWord } from '../actions';
import { Button, Spinner, resetAction, CardText, Card, BodyText, CardSection } from './common';
import styles from '../styles';

import Keyboard from './Keyboard';
import GoldStar from './GoldStar';

class WordScreen extends Component {
  static navigationOptions = () => ({
    title: `Practice`,
    headerStyle: {backgroundColor: '#81D4FA'}
  });

  state = {
    answer: '',
    hidden: true,
    button: false
  }

  componentWillMount() {
    Tts.setDefaultRate(0.4);
    this.props.setupWords();
  }

  answerFlashcard(answer) {
    this.props.answerWord({
      answer,
      list: this.props.currentWordList,
      dictionary: this.props.dictionary,
      nextWord: this.props.nextWord,
      points: this.props.points
    });
  }

  readWords(word) {
    this.setState({ button: false });
    let text = word ? word.text : '';
    Tts.speak(text);
    Tts.speak(`spell ${text}`);
    setTimeout(() => { this.setState({ button: true }) }, 4000)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'story') {
      this.props.navigation.dispatch(resetAction('story'));
    } else if (this.props.word !== nextProps.word ||
      this.props.points !== nextProps.points) {
      this.readWords(nextProps.word);
    }
  }

  onSubmit() {
    if (this.state.answer === '') {
      Tts.speak('Type the word!');
      this.readWords(this.props.word);
      return;
    }
    if (this.state.answer === this.props.word.text) {
      Tts.speak('Good job!');
      this.setState({ hidden: false, answer: '' });
      setTimeout(() => {
        this.answerFlashcard(true);
        this.setState({ hidden: true });
      }, 500)
    } else {
      this.setState({ hidden: false, answer: '' });
      Tts.speak(this.props.word.text);
      setTimeout(() => {
        this.setState({ hidden: true })
        this.answerFlashcard(false);
      }, 3000);
    }
  }

  render() {
    const { points, pointsNeeded, word, loading } = this.props;
    let text = word ? word.text : '';
    return (
      <View style={styles.container}>
        <Card>
          <View style={{ padding: 10, alignItems: 'center'}}>
            <GoldStar points={points} />
          <BodyText size="small">{points}/{pointsNeeded}</BodyText>
          </View>
        </Card>
        <Card>
          {this.state.hidden ? null :
          <CardText>{text}</CardText>}
        </Card>
          {loading || !this.state.hidden ?
            <Card>
            <CardSection>
              <Spinner size="small" />
            </CardSection>
          </Card> :
            <Card>
            <CardSection>
              <Keyboard onChange={() => console.log(letter)} />
            </CardSection>
            <CardSection>
              {this.state.button ?
              <Button onPress={() => this.onSubmit()}>
                Submit
              </Button> :
              null}
            </CardSection>
          </Card>
          }
      </View>
    );
  }
}

const mapStateToProps = ({ user, words, story }) => {
  const { points, pointsNeeded, loading, status } = user;
  const { dictionary, wordCount, nextWord, currentWordList } = words;
  const word = dictionary[currentWordList[0]];
  return { points, pointsNeeded, word, nextWord, currentWordList, dictionary, loading, status };
}

export default connect(mapStateToProps, { setupWords, answerWord, replaceWord })(WordScreen);

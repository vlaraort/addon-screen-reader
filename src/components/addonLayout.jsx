/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Toggle } from 'react-toggle-component';
import styled from 'styled-components';
import ScreenReader from '../screen-reader/screenReader';

const Label = styled.label`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  white-space: nowrap;
  align-items: center;
  cursor: pointer;
  margin: 16px 8px;
  font-size: 18px;
`;

const TextContent = styled.p`
  font-size: 18px;
  border-radius: 10px;
  border: 2px solid blue;
  padding: 10px;
  margin: 16px 8px;
  background: lightgrey;
`;

export default class AddonLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenReaderText: '',
      voice: false,
      text: false,
      screenReaderStatus: false,
    };
    this.handleTextToggleChange = this.handleTextToggleChange.bind(this);
    this.handleVoiceToggleChange = this.handleVoiceToggleChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener(
      'screen-reader-text-changed',
      this.handleTextChange.bind(this),
    );
    this.storybookIframe = document.getElementById('storybook-preview-iframe');
  }

  componentWillUnmount() {
    window.removeEventListener(
      'screen-reader-text-changed',
      this.handleTextChange,
    );
  }

  handleTextChange(evt) {
    const { text } = evt.detail;
    this.setState({
      screenReaderText: text,
    });
  }

  async handleVoiceToggleChange(ev) {
    await this.setState({ voice: ev.currentTarget.checked });
    this.updateReaderStatus();
  }

  async handleTextToggleChange(ev) {
    await this.setState({ text: ev.currentTarget.checked });
    this.updateReaderStatus();
  }

  async updateReaderOutput() {
    const { voice, text } = this.state;
    this.screenReader.voiceEnabled = voice;
    this.screenReader.textEnabled = text;
  }

  async updateReaderStatus() {
    // Start reader from screenReaderStatus off
    const { voice, text, screenReaderStatus } = this.state;
    if (
      !screenReaderStatus
      && (voice || text)
    ) {
      await this.setState({ screenReaderStatus: true });
      this.screenReader = new ScreenReader();
      this.updateReaderOutput();
      this.screenReader.start();
    } else if (
      // Stop reader
      screenReaderStatus
      && !voice
      && !text
    ) {
      await this.setState({ screenReaderStatus: false });
      this.screenReader = null;
      //   As we mutate the of the story, the safest way to stop is to rerender everything again;
      this.storybookIframe.contentWindow.location.reload();
    } else {
      this.updateReaderOutput();
    }
  }

  render() {
    return (
      <>
        <Label htmlFor="toggle-voice">
          <Toggle name="toggle-voice" onToggle={this.handleVoiceToggleChange} />
          Voice Reader
        </Label>
        <Label htmlFor="toggle-text">
          <Toggle name="toggle-text" onToggle={this.handleTextToggleChange} />
          Text Reader
        </Label>
        <TextContent hidden={!this.state.text}>
          {this.state.screenReaderText}
        </TextContent>
      </>
    );
  }
}

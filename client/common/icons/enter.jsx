import React, { Component } from 'react'
import IconCore from './icon-core'

export default class EnterIcon extends Component {
  render () {
    return (
      <IconCore {...this.props} >
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
      </IconCore>
    )
  }
}

import React, { Component } from 'react'
import { MicOn, MicOff, Run, VideoOn, VideoOff } from '../../common/icons'
import IconButton from '../../common/icon-button'
import Sock from '../../lib/sock'
import { Bus } from '../../lib/emitters'
import store from 'store'

export default class Controls extends Component {
  state = {}

  toggleCore = (ev, toToggle) => {
    ev.stopPropagation()

    if (toToggle != 'away') {
      Bus.emit('toggle-stream', toToggle)
    } else {
      const me = store.get('me')
      me[toToggle] = !me[toToggle]
      store.set('me', me)
      Sock.emit('me', me)
    }
  }

  toggle = {
    audio: ev => this.toggleCore(ev, 'audio'),
    video: ev => this.toggleCore(ev, 'video'),
    away: ev => this.toggleCore(ev, 'away'),
  }

  render() {
    const { me, audio, video, away } = this.props

    return (
      <div className="controls">
        <div className="audio">
          <IconButton onClick={this.toggle.audio} id="mute">
            {audio ? <MicOn /> : <MicOff />}
          </IconButton>
        </div>

        <div className="video">
          <IconButton onClick={this.toggle.video} id="toggle-video">
            {video ? <VideoOn /> : <VideoOff />}
          </IconButton>
        </div>

        <div className="away">
          <IconButton onClick={this.toggle.away} id="toggle-away">
            {away ? <Run /> : <Run />}
          </IconButton>
        </div>
      </div>
    )
  }
}

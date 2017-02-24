import { Component, h } from 'preact'
import { MicOn, MicOff, Run, VideoOn, VideoOff } from '../../common/icons'
import IconButton from '../../common/icon-button'
import Sock from '../../lib/sock'
import store from 'store'

export default class Controls extends Component {
  state = {}

  toggleCore = toToggle => {
    const me = store.get('me')
    me[toToggle] = !me[toToggle]
    store.set('me', me)

    Sock.emit('me', me)
  }

  toggle = {
    audio: () => this.toggleCore('audio'),
    video: () => this.toggleCore('video'),
    away: () => this.toggleCore('away')
  }

  render ({me, audio, video, away}) {
    return (
      <div className='controls'>
        <div className='audio'>
          <IconButton onClick={this.toggle.audio} >
            {audio
              ? <MicOff />
              : <MicOn />
            }
          </IconButton>
        </div>

        <div className='video'>
          <IconButton onClick={this.toggle.video} >
            {video
              ? <VideoOff />
              : <VideoOn />
            }
          </IconButton>
        </div>

        <div className='away'>
          <IconButton onClick={this.toggle.away} >
            {away
              ? <Run />
              : <Run />
            }
          </IconButton>
        </div>
      </div>
    )
  }
}

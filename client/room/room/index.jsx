import { Component, h } from 'preact'
import Grid from '../grid'
import UserBlob from '../user-blob'
import Sock from '../../lib/sock'
import Updates from '../../lib/updates'
import theme from '../../lib/theme-manager'
import VolumeDetector from './volume-detector'

const UPDATE_INTERVAL = 30

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

export default class Room extends Component {
  state = {
    dimensions: {},
    translate: {x: 0, y: 0},
    localMedia: {audio: true, video: false},
    localStream: null
  }

  mousePos = {}
  intervalId = null

  componentWillMount () {
    Sock.on('dimensions', this.handleDimensions)
    Updates.on('translate', this.handleTranslate)

    this.setStream()
  }

  componentWillUnmount () {
    Sock.off('dimensions', this.handleDimensions)
    Updates.off('translate', this.handleTranslate)
    VolumeDetector.detach()
  }

  setStream = () => navigator.getUserMedia(
    this.state.localMedia,
    // on success
    stream => {
      console.log('new stream')
      this.setState({localStream: stream})
      VolumeDetector.register(stream, this.props.me.id)
    },
    // on failure
    error => console.log(error)
  )

  handleDimensions = (data) => this.setState({ dimensions: data })
  handleTranslate = (data) => this.setState({ translate: data })

  onMouseDown = () => {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = setInterval(this.moveUser, UPDATE_INTERVAL)
  }

  onMouseUp = () => clearInterval(this.intervalId)

  onMouseMove = (ev) =>
    this.mousePos = {
      clientX: ev.clientX,
      clientY: ev.clientY
    }

  moveUser = () => Updates.emit('location', this.mousePos)

  render ({me, users}, {translate, dimensions, localStream}) {
    const blobs = users.map((u, idx) => (
      <UserBlob user={u}
        idx={idx}
        me={me}
        localStream={localStream}
        translate={translate}
        isMe={me && u.id == Sock.id}
      />
    ))

    return (
      <div id='plaza'
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      >
        <div id='viewport' style={{transform: `translate3d(${translate.x}px, ${translate.y}px, 0px)`}} >
          <Grid dimensions={dimensions} />
          {blobs}
        </div>
      </div>
    )
  }
}

function formatTime(s){
  let seconds = s;
  let minutes = Math.floor(seconds / 60);
  seconds = seconds - minutes * 60;
  let minutesStr = minutes.toString();
  if(minutes < 10){
    minutesStr = "0" + minutesStr;
  }
  let secondsStr = seconds.toString();
  if(seconds < 10){
    secondsStr = "0" + secondsStr;
  }
  return minutesStr + ":" + secondsStr;
}
function minutesTos(minutes){
  return minutes * 60;
}
class Break extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
    <div id = "break">
        <label id = "break-label">Break Length</label>
        <div className="buttons">
          <button id="break-increment" onClick={this.props.onclick(1)}><i className="fa fa-angle-up"/></button>
          <label id="break-length">{this.props.length}</label>
          <button id="break-decrement" onClick={this.props.onclick(-1)}><i className="fa fa-angle-down"/></button>
        </div>
    </div>
    );
  }
}

class Session extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
    <div id = "session">
        <label id = "session-label">Session Length</label>
        <div className="buttons">
          <button id="session-increment" onClick={this.props.onclick(1)}><i className="fa fa-angle-up"/></button>
          <label id="session-length">{this.props.length}</label>
          <button id="session-decrement" onClick={this.props.onclick(-1)}><i className="fa fa-angle-down"/></button>
        </div>
    </div>
    );
  }
}

class Timer extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
    <div>
        <label id="timer-label">{this.props.label}</label>
        <h1 id="time-left">{formatTime(this.props.time)}</h1>
    </div>
    );
  }
}

class TimerController extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
    <div>
        <button id="start_stop" onClick={this.props.onclickPlay()}><i className="fa fa-play"/></button>
        <button id="reset" onClick={this.props.onclickReset()}><i className="fa fa-sync-alt"/></button>
        <audio id="beep" src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"/>
    </div>
    );
  }
}
class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {breakLength: 5, sessionLength: 25, paused: true, time: minutesTos(25), label: "Session"};
    this.modifyBreak = this.modifyBreak.bind(this);
    this.modifySession = this.modifySession.bind(this);
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
    this.intervalFunc = this.intervalFunc.bind(this);
  }
  modifyBreak(value){
    return () => {
      if(this.state.breakLength + value <= 60 && this.state.breakLength + value > 0){
        this.setState({breakLength: this.state.breakLength + value});
      }
    }
  }
  modifySession(value){
    return () => {
      if(this.state.sessionLength + value <= 60 && this.state.sessionLength + value > 0){
        this.setState({sessionLength: this.state.sessionLength + value, time: minutesTos(this.state.sessionLength + value), paused: true});
      }
    }
  }
  intervalFunc(){
    if(this.state.time > 0){
      this.setState({time: this.state.time - 1});
    }
    else{
      clearInterval(this.interval);
      if(this.state.label === "Session"){
        this.setState({time: minutesTos(this.state.breakLength), label: "Break"});
      }
      else{
        this.setState({time: minutesTos(this.state.sessionLength), label: "Session"});
      }
      this.interval = setInterval(() => this.intervalFunc(), 1000);
      document.getElementById("beep").play();
    }
  }
  startStop(){
    return () => {
      if(this.state.paused){
        this.setState({paused: false});
        this.interval = setInterval(() => this.intervalFunc(), 1000);
      }
      else{
        this.setState({paused: true});
        clearInterval(this.interval);
      }
    }
  }
  reset(){
    return () => {
      this.setState({breakLength: 5, sessionLength: 25, paused: true, time: minutesTos(25), label: "Session"})
      clearInterval(this.interval);
      document.getElementById("beep").load();
    }
  }
  render(){
    return(
      <div id="clock">
        <div className="modifiers">
          <Break length={this.state.breakLength} onclick={this.modifyBreak}/>
          <Session length={this.state.sessionLength} onclick={this.modifySession}/>
        </div>
        <Timer time={this.state.time} label={this.state.label}/>
        <TimerController onclickPlay={this.startStop} onclickReset={this.reset}/>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("container"));

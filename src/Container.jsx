import React from 'react';
import App from './App.js';
import './Container.css';
import spinner from './assets/spinner-red.gif'

export default class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      begin: false,
      loading: true,
      framesProcessed: 0,
      guessData: {
      }
    }
    this.handleClick = this.handleClick.bind(this);
    // this.handleGuess = this.handleGuess.bind(this);
    // this.handleCountFrames = this.handleCountFrames.bind(this);
  }

  componentDidMount() {
    // setInterval(() => this.setState({framesProcessed: this.state.framesProcessed+1}), 500)
  }

  handleClick() {
    this.setState({begin: true})
    setTimeout(() => {
      this.setState({loading: false})
    }, 5000);
  }

  render() {
    return (
    <div id='container'>

      {this.state.begin === false ?
      // Landing Page
        <div>
            <h1 id='header-title'>Home Appetit</h1>
          <hr id='first-hr'></hr>
          <br></br>
            <a id='header'>Project GitHub</a>
          <br></br>
            <span id='header'>Still image detection powered by:</span>
          <br></br>
            <div id='support-links'>
              <a id='header-links-1' href='https://www.npmjs.com/package/@tensorflow/tfjs'>Tensorflow.js</a>
              <span id='header'>|</span>
              <a id='header-links-2' href='https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd'>Detection Model</a>
            </div>
          <div id='wrapper'>
            <button onClick={this.handleClick} type="button">Launch</button>
          </div>
            {/* <hr id='second-hr'></hr> */}
          {/* <br/>
          <br/> */}
            <span id='footer'>Created by Tracy, Emily</span>
          <br></br>
            
        </div> :

        // App Page
        <div>
          <h3 id='header'>Home Appetit</h3>
          <hr id='first-hr'></hr>
          <>
            {this.state.loading === true ? 
            <span id='header'><img src={spinner} alt="loading ..." /></span> : 
            <></>}
            <App 
              handleGuess={this.handleGuess} 
              handleCountFrames={this.handleCountFrames}
              framesProcessed={this.state.framesProcessed}
            />
          </>
        </div>
      }
    </div>
    )
  }
}
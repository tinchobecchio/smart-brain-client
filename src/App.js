import './App.css';
import { Component } from 'react';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

const baseURL = 'https://smart-brain-api-jkoc.onrender.com'
class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    const {id, name, email, entries, joined } = data
    this.setState({
      user: {
        id,
        name,
        email,
        entries,
        joined
      }
    })
  }

  calculateFaceLocation = (obj) => {
    const clarifaiFace = obj.output.data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width),
      topRow: clarifaiFace.top_row * height,
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value})
  }
  
  onBtnSubmit = () => {
    this.setState({imageUrl: this.state.input})

    fetch(`${baseURL}/image`, { // este llama a la api en el server
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        imgUrl: this.state.input
      })
    })
      .then(response => response.json())
      .then(result => {
        if(result.status === 'success') {
          fetch(`${baseURL}/image`, { // este te aumenta las entries del user con el id que le pases
            method: 'put',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count} ))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(result))
      })
      .catch(error => console.log('error', error));

  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
            <Logo />
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onBtnSubmit={this.onBtnSubmit}
            />
            <FaceRecognition 
              imageUrl={imageUrl}
              box={box}
            />
          </div> 
          :(
            route === 'signin'
              ? <SignIn 
                onRouteChange={this.onRouteChange}
                loadUser={this.loadUser}
                baseURL={baseURL}
                />
                : <Register 
                  onRouteChange={this.onRouteChange}
                  loadUser={this.loadUser}
                  baseURL={baseURL}
                />
          )
        }
      </div>
    )
  }
}

export default App;
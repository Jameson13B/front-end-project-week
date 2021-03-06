import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

import Banner from './Banner';
import ListView from './ListView';
import CreateNote from './CreateNote';
import ViewNote from './ViewNote';
import EditNote from './EditNote';
import DeleteNote from './DeleteNote';
import LoginForm from './LoginForm';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      deleting: false,
      loggedIn: true,
      searchVal: ''
    }
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API}/notes`)
      .then(response => {
        this.setState({ notes: response.data })
      })
      .catch(err => {console.log(err)})
  }
  toggleDeleting = () => {this.setState({ deleting: !this.state.deleting })}
  toggleLogin = () => {this.setState({ loggedIn: !this.state.deleting })}
  compare = (a,b) => {
    if (a.title.toUpperCase() < b.title.toUpperCase()) {
      return -1;
    } else if (a.title.toUpperCase() > b.title.toUpperCase()) {
      return 1;
    } else {return 0;}
  }
  sortAz = () => {
    let notes = this.state.notes.slice().sort(this.compare);
    this.setState({ notes })
  }
  sortZa = () => {
    let notes = this.state.notes.slice().sort(this.compare).reverse();
    this.setState({ notes })
  }
  handleRefresh = () => {
    axios
      .get(`${process.env.REACT_APP_API}/notes`)
      .then(response => {
        this.setState({ notes: response.data })
      })
      .catch(err => {console.log(err)})
  }
  handleSearch = (e) => {
    this.setState({ searchVal: e.target.value })
  }

  render() {
    return (
      <div className="App">
        <Banner />
        <Route exact path='/' render={() => <ListView notes={this.state.notes.filter(note => note.title.includes(this.state.searchVal))} sortAz={this.sortAz} sortZa={this.sortZa} handleSearch={this.handleSearch} searchVal={this.state.searchVal} />} />
        <Route path='/create' render={() => <CreateNote handleRefresh={this.handleRefresh} />} />
        <Route path='/view/:id' render={(props) => <ViewNote {...props} notes={this.state.notes} toggleDeleting={this.toggleDeleting} handleRefresh={this.handleRefresh} />} />
        <Route path='/edit/:id' render={(props) => <EditNote {...props} notes={this.state.notes} handleRefresh={this.handleRefresh} />} />
        {this.state.deleting ? (<Route path='/view/:id' render={props => (<DeleteNote {...props} toggleDeleting={this.toggleDeleting} handleRefresh={this.handleRefresh} />)}/>) : null}
        {this.state.loggedIn ? null : (<Route path='/' render={props => (<LoginForm {...props} toggleLogin={this.toggleLogin} />)}/>)}
      </div>  
    );
  }
}

export default App;

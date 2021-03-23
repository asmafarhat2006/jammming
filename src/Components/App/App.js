import './App.css';
import React from 'react';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {PlayList} from '../PlayList/PlayList.js';
import Spotify from './../../util/Spotify';
class App extends React.Component {
  
  constructor(props){
    super(props);
    let searchResultsDefault = [
      



    ];
    let playlistTracksDefault = [
      
    ];
   
    this.state  = { playListName: 'First playlist',searchResults:searchResultsDefault,playlistTracks:playlistTracksDefault};
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
   
  }
  savePlaylist(){
    const trackURIs  = [];
    this.state.playlistTracks.forEach((track)=>{
      trackURIs.push(`spotify:track:${track.id}`);

    });
    Spotify.savePlaylist(this.state.playListName,trackURIs);
    this.setState({playListName:'New PlayList',playlistTracks:[]});
    //return trackURIs;
  }
  addTrack(track){
    /* if you find the track in existing playlist, break out of the function */
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;

    }
    const updatedPlayListTracks = this.state.playlistTracks;
    updatedPlayListTracks.push(track);
    this.setState({ playlistTracks : updatedPlayListTracks});
  }
  removeTrack(removetrack){
    const updatedPlayListTracks = this.state.playlistTracks.filter(track => track.id !== removetrack.id);
    this.setState({ playlistTracks : updatedPlayListTracks});
  }
  updatePlaylistName(name){
    this.setState({ playListName : name});
  }
 
  search(term){
    console.log(term);
    Spotify.search(term)
    .then((jsonResponse)=>{
        if(!jsonResponse.tracks){
          return [];
        }else{
          const tracksArray =  jsonResponse.tracks.items.map( (track) =>{
          /* to not display existing tracks  from playlist */
            if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id) === undefined) {
             
            return { 
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
             };
            
            }

          });

          var filteredtracksArray = tracksArray.filter(function (el) {
            return el != null;
          });
          console.log(filteredtracksArray);
         
      /*  const tracksArray =  jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          }));*/
          console.log(filteredtracksArray);
          this.setState({searchResults:filteredtracksArray});
        }
       
    });
  }
  render(){

    return (
      <div>
    <h1>Ja<span className="highlight">mmm</span>ing</h1>
    <div className="App">
      <SearchBar onSearch={this.search}/>
      <div className="App-playlist">
        <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack}/>
        <PlayList playlistName  = {this.state.playListName} 
        playlistTracks = {this.state.playlistTracks}
        onRemove = {this.removeTrack}
        onNameChange = {this.updatePlaylistName}  
        onSave = {this.savePlaylist}
         />
      </div>
    </div>
  </div>
    );
  }
  
}

export default App;

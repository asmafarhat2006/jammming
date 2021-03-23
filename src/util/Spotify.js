
let ACCESS_TOKEN = '';
let EXPIRES_IN = '';
const CLIENT_ID = '106f45ca9c9e4a9ba46753a64bc39986';
const REDIRECT_URI = 'http://localhost:3000/';
const Spotify = {

    getAccessToken(){
        if(ACCESS_TOKEN){
            return ACCESS_TOKEN;
        }
        const accesstokenMatch = window.location.href.match(/#access_token=([^&]*)/);
        if(accesstokenMatch){
            ACCESS_TOKEN = window.location.href.match(/#access_token=([^&]*)/)[1];
            EXPIRES_IN = window.location.href.match(/expires_in=([^&]*)/)[1];
         

            /* wipe out tokens after expires time */
            window.setTimeout(() => ACCESS_TOKEN = '', EXPIRES_IN * 1000);
            window.history.pushState('Access Token', null, '/');
        }
        else{
            window.location = 
            `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
        }
    },
    search(term){
 
        Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          })
          .then((response)=>{
           // console.log(response.json());
            return response.json();
          });
          /*
          .then((jsonResponse)=>{
            console.log(jsonResponse);
            if(!jsonResponse.tracks){
                return [];
            }else{
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                  }));
            }


          });*/
            
        
        
    },
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
          return;
        }
        Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
        let userId;
    
         fetch("https://api.spotify.com/v1/me", { headers: headers })
          .then((response) => {
           return response.json();
          })
          .then((jsonResponse) => {
            userId = jsonResponse.Id;
             fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
              headers: headers,
              method: "POST",
              body: JSON.stringify({ name: name }),
            })
              .then((response) => {
                return response.json();
              })
              .then((jsonResponse) => {
                console.log(jsonResponse);
                const playlistId = jsonResponse.id;
                 fetch(
                  `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                  {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ uris: trackUris }),
                  }
                ).then((response)=>{
                    if(response.ok()){
                        return playlistId;
                    }
                });
              });
          });
      }

};

export default Spotify;

import React from 'react';
import './Track.css';
export class Track extends React.Component{
  
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  addTrack() {
    this.props.onAdd(this.props.track);
  }
  removeTrack() {
    this.props.onRemove(this.props.track);
  }
  renderAction(){
		if (this.props.isRemoval){
			return <a className="Track-action" onClick={this.removeTrack}>&#8722;</a>
		}else{
			return <a className="Track-action" onClick={this.addTrack}>&#43;</a>
		}		
	}

  render(){

        return (
            <div className="Track">
            <div className="Track-information">
              <h3>{this.props.track.name}</h3>
              <p>{this.props.track.artist} | {this.props.track.album}</p>
            </div>
            {this.renderAction()}
          </div>
      );
    }

}

import React, { Component } from 'react'
import { Comments, ToggleBar, Comment } from '../presentation'
import firebase from 'firebase'
import { Base64 } from 'js-base64'

class Widget extends Component {
	constructor(){
		super()
		this.state = {
			showComments: false,
			comments: [],
			firebase: null
		}
	}

	componentDidMount(){
		const firebaseApp = firebase.initializeApp({
			apiKey: "AIzaSyChWQ-Upr64p-1DLmOYmNAgFCxM6UUcRdA",
    	authDomain: "react-chat-plugin.firebaseapp.com",
    	databaseURL: "https://react-chat-plugin.firebaseio.com",
    	projectId: "react-chat-plugin",
    	storageBucket: "react-chat-plugin.appspot.com",
    	messagingSenderId: "859650861352"
		})

		this.setState({
			firebase: firebaseApp
		})

		const path = Base64.encode(window.location.href)+'/comments'

		firebaseApp.database().ref(path).on('value', (snapshot) => {
			if(snapshot == null){
				return
			}

			const data = snapshot.val()
			console.log('COMMENTS UPDATED: '+JSON.stringify(data))
			this.setState({
				comments: data.reverse()
			})
		})
	}


	toggleComments(){
		console.log('toggleComments: '+this.state.showComments)
		this.setState({
			showComments: !this.state.showComments
		})
	}

	submitComment(event){
		if(event.keyCode != 13)
			return

		const comment = {
			text: event.target.value,
			timestamp: Date.now()
		}

		let comments = Object.assign([], this.state.comments)
		const path = Base64.encode(window.location.href)+'/comments/'+comments.length

		this.state.firebase.database().ref(path).set(comment)
		console.log('submitComment: '+JSON.stringify(comments))
		event.target.value = ''
	}

	render(){
		if(this.state.showComments == true)
			return (
				<div style={style.comments}>
					<div>
						<input onKeyDown={this.submitComment.bind(this)} style={style.input} type="text" placeholder="Enter Comment" />
					</div>
					{
						this.state.comments.map((comment, i) => {
							return <Comment key={comment.timestamp} {...comment} />
						})
					}


					<ToggleBar label="Hide Comments" onToggle={this.toggleComments.bind(this)}/>
				</div>
			)

		return(
			<ToggleBar label='Show Comments' onToggle={this.toggleComments.bind(this)}/>
			
		)
	}
}

const style = {
	comments: {
		zIndex: 100,
		height: 650,
		width: 320, 
		position: 'fixed', 
		top: 0, 
		right: 0, 
		background: '#f1f9f5',
		borderLeft: '1px solid #ddd',
		overflowY: 'scroll',
		paddingBottom: 96
	},
	input: {
		zIndex: 100,
		width:100+'%', 
		height: 38, 
		border:'none', 
		padding:9,
		borderBottom: '1px solid #ddd'
	}
}

export default Widget
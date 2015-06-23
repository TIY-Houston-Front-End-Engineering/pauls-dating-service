"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")

import {Promise} from 'es6-promise'
import React from 'react'

const subscribe_key = `sub-c-6b8a95c8-19ab-11e5-bc40-02ee2ddab7fe`,
    publish_key  = `pub-c-cb375025-8aee-4e13-9626-087026c2677d`

const pubnub = PUBNUB({                         
    publish_key   : publish_key,
    subscribe_key : subscribe_key
})

const subscribe = (channel, message) => pubnub.subscribe({ channel, message })

const publish = (channel, message, callback) => pubnub.publish({ channel, message, callback })

// window.app = {pubnub, subscribe, publish}

// setInterval(() => publish('hello', {name: 'matt'}), 5000)
// publish('hello', 'test message')
// subscribe('hello', (data) => console.log(data))

var name = window.prompt('What\'s your name?')
// var messages = [] //--> { sender: 'Paul', text: 'Hey, baby. You're new here, aren't you? }

class Message extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return (<li>
            <p>{this.props.message.text}</p>
            <span>{this.props.message.name}</span>
        </li>)
    }
}

class Chat extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            messages: []
        }
    }
    componentWillMount(){
        subscribe('meeting_room', (data) => {
            var newMessages = this.state.messages.concat(data)
            this.setState({messages: newMessages})
        })
    }
    _send(e){
        e.preventDefault()
        var text = React.findDOMNode(this.refs.message)
        publish('meeting_room', {name, text: text.value})
        text.value = ''
    }
    render(){
        return (<div>
            <ul>
                {this.state.messages.map((data) => <Message message={data} />)}
            </ul>
            <form onSubmit={(e) => this._send(e)}>
                <div><input ref="message" /></div>
                <button>send</button>
            </form>
        </div>)
    }
}

React.render(<Chat />, document.querySelector('.container'))
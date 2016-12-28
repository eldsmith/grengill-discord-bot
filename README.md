# Grengill Discord Bot
A simple NodeJS bot for discord meant to be lightweight at its core but simple to implement plugins and new features.
The project is very much in alpha and filled with bugs, along with some of the code needing to be rewritten for a better
implementation.

At it's core this is about making a flexible api that other plugins connect to within the app or from another service
through an api or WebSockets. Currently the core features are centered around playing music from YouTube and connecting
the bot as a music player to various services and plugins, but in the future it will focus on more than just music.

## Current Features
* Basic playback (play, skip, add, playlist)
* Joining a Voice Channel
* Some event emitters (Adding song, adding array of songs)
* Barebones sockets (adding songs, used in [Grengill Web Interface](https://github.com/eldsmith/grengill-web))

# Built in Plugins

## Discord Chat
This plugin handles some basic chat functionality

* Search youtube and add song
* Join voice channel of asking user
* Basic playback controls
* Output first 5 entries of playlist
* History of songs played
* Mix history into current playlist

# Instructions
* Run `npm install`
* Make sure that all .env variables are in place, use .env.example as template

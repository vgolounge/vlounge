# INTRODUCTION

VGOLounge is a PHP based web application that is written on the Lumen Framework.
It also has a nodejs servers which handle websocket connections from the lumen clients.
It uses a mysql / mariadb backend server to store all the data.

# Installation

## Requirements
 
 - PHP >= 7.1.3
 - PDO PHP 
 - OpenSSL PHP Extension
 - Mbstring PHP extension
 - nodejs >= 8.11
 - npm >= 6.1
 - Apache2
 - OPSkins Oauth Login Key
 - OpSkins Account with API key for VGO skins and prices and holding traded items. 
 
## Install

Clone this repository in to your public directory in the apache server. 
The vgo.sql file should be dumped in to mysql database.
when you are in the cloned directory please run 

- `npm install` install all the required NPM packages
- `composer install` install the php required components and autoload.php
- `npm run-script js` compile modified JS files using gulp to final output
- `npm run-script css` compile modified CSS file to output css 
- `artisan migrate` create database in the backend
- `artisan db:seed` put in sample data in to the database
- copy .env.example as .env and modify  it for your environment

# Admin Site

 `http://< your host >/dashboard`
 
 To access the admin panel where you can control the variables on the website.
 For you to access this section you will first need to login to the site once, then go in to the database look in to the `users` table look for the column called `is_admin` and set it to 1 foryour user record. After this you will be  

# Internals 
 
 The backend uses PHP in the lumen framework, the frontend uses react.js to render the UI
 Websockets are used to by the frontend which are served by nodejs scripts.
 
 ## Overview of Code Structure
 
 ### Public
 
 This folder stores all the public facing files. Your webserver Document Root should point to this folder.
 
 ### nodejs_scripts
 
 Contains the websocket servers. 
 There are 2 servers 
  - `node nodejs_scripts/ws-server.js` is the server that sends Play by Play match events eg : kills and round start and round end in a game.
  - `node nodejs_scripts/event-server.js` this server delivers the backend events that occurs and are pushed to the frontend eg: match goes from upcoming to Live status
  You can use the linux `screen` command or `tmux` to run these scripts in the backend.
 ### public/csgo_teams 
 
 COntains the images for CSGO teams. Files are just stored using the team ID.
 
 ### routes/web.php
 
 This file contains the lumen routes for the website. If you need to add a function or change a function.
 
 ### app/Console/Commands
 
 This folder contains the backend functions that we provide to mentain the website. You can see these functions using the ./artisan command in the root folder.
 
 ### resources/assets/js sass
 
 This folder contains the source files for React.js Components. sass contains the sass/css scripts. 
 All these files have to be compiled using gulp which will be installed using npm install
 
 ## UI Overview
 
 As you know the UI is made using react.js. In this section we will explain the overview of the UI and how its built.
 Each page is a react component which then hosts sub components.
 
 ### Frontpage
 
 This is the default page that loads on the site. It displays the matches in upcoming, live and past matches
 
 ### MatchPage
 
 This page displays all the details about a particular match. It is caused when a person clicks on any other pages
 
 ### Account
 
 This section displays all the information about the users account. They will be able to access this page after the user logs in to the site.
 
 ## Background Tasks
 
 ### nodejs ws-server.js
 
 this script takes Play by Play match event which are inserted in to match_data table.
 
 ### nodejs event-server.js 
 
 this script takes events inserted in to site_events table and distributes them to all the connected clients.
 
 ### CRON Jobs
 
 Please add 
 
 `* * * * * php /path-to-your-project/artisan schedule:run >> /dev/null 2 > &1`
 
 to your cron table ( `/etc/crontab` ). 
 
 # Screenshots
 
 <img src="/screenshot/vgo-screen1.jpg" width="500">
 <img src="/screenshot/vgo-screen2.jpg" width="500">
 <img src="/screenshot/vgoscreen-3.jpg" width="500">
 <img src="/screenshot/vgoscreen-4.jpg" width="500">
 <img src="/screenshot/vgoscreen-5.jpg" width="500">

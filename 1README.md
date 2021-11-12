## User-Pitches
## Author
By Sr Betty Nabuuso(fsp)

## Description
This is a Python-Flask Application that allows users to create one minute pitch. You only have 60 seconds to impress someone. 1 minute can make or break you. The users will submit their one minute pitches and other users will vote on them and leave comments to give their feedback on them.

User Stories
As a user I would like:

* To view the different categories.
* see the pitches other people have posted.
* comment on the different pitches and leave feedback.
* submit a pitch in any category.
* vote on the pitch they liked and give it a downvote or upvote.

# How it works
* A user needs to sign up
* A user needs to sign in to vote and post pitches
* A user can also create categories and post pitches within the application

## Technologies Used
Python3.6
Flask framework
Bootstrap
PostgreSQL
## Setup/Installation Requirements
* Internet access
* git clone https://github.com/Nabuuso/User-Pitches.git
* cd Pitches
* To install a virtual environment
python3 -m venv virtual
source virtual/bin/activate
* To install all dependencies
python3.6 -m pip install -r requirements.txt
* To change the config_name parameter from 'production' to 'development'
* Inside the manage.py module i.e:- app = create_app('production') should be app = create_app('development')
*Then run python3.6 manage.py server to get the app running navigate to http://127.0.0.1:5000/ and it will open in your browser
## Dependancy Installations
* pip install python3.6
* pip install flask
* pip install flask-bootstrap
* pip install flask-script
* pip install flask-wtf
* pip install flask-migrate
* pip install flask-login
* pip install Flask-Mail
* pip install flask-uploads

# Support and Contact Details
You can reach out to me at wagabaliz@gmail.com for Reviews, Collaborations and Comments

Licence
MIT License

Copyright (c) 2021  Sr Betty Nabuuso(fsp)

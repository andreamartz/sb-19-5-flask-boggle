from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    # Does the board contain a 5 x 5 grid of letters?
    # When the game is restarted, do we get a different set of letters?
    # Are the letters centered in their boxes?
    # When a valid word is submitted, 
    # When an invalid word is submitted,

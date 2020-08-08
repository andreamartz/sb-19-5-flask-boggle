from flask import Flask, session, request, redirect, render_template, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "Gy6h72uIj0"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)
boggle_game = Boggle()


@app.route('/')
def show_game_board():
    """Show game board."""
    board = boggle_game.make_board()
    print(board)
    # Make the game board available in session
    session['board'] = board
    return render_template("board.html", board=board)



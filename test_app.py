from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# Stop the debug toolbar from working during our tests
# app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class FlaskTests(TestCase):
    def test_game_board(self):
        """Test that the HTML is properly displayed"""
        with app.test_client() as client:
            res = client.get('/')
            self.assertIn('board', session)
            self.assertEqual(res.status_code, 200)
            html = res.get_data(as_text=True)

            self.assertIn('<h1 class="title">Play Boggle!</h1>', html)

    # test that when a valid word is entered, we get the correct response
    def test_valid_word(self):
        """Test if word is valid, i.e., on the board and in the word list.
        To do this, we modify the board in the session"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "R"],
                                 ["D", "O", "G", "T", "E"],
                                 ["C", "A", "T", "E", "E"],
                                 ["G", "A", "T", "E", "S"]]

            res = client.get('/word-check?word=gate')
            self.assertEqual(res.json['result'], 'ok')

    def test_word_not_on_board(self):
        """Test if word is not on the board.
        To do this, we modify the board in the session"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "R"],
                                 ["D", "O", "G", "T", "E"],
                                 ["C", "A", "T", "E", "E"],
                                 ["G", "A", "T", "E", "S"]]

            res = client.get('/word-check?word=mobile')
            self.assertEqual(res.json['result'], 'not-on-board')

    def test_not_word(self):
        """Test if word is not on the board.
        To do this, we modify the board in the session"""
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"],
                                 ["C", "A", "T", "T", "R"],
                                 ["D", "O", "G", "T", "E"],
                                 ["C", "A", "T", "E", "E"],
                                 ["G", "A", "T", "E", "S"]]

            res = client.get('/word-check?word=ttt')
            self.assertEqual(res.json['result'], 'not-word')

from flask import render_template, redirect, flash, url_for, request, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime

from app import app, db
from app.forms import SignInForm, SignUpForm
from app.models import User, Game_Statistics, Puzzle

import random
import json

from werkzeug.urls import url_parse

# TODO: add comments
@app.route('/')
@app.route('/index')
# TODO: Decide if we want unathenticatd (non-users) to be able to play the game -> if yes form() needs to be changed
# @login_required
def index():
    return render_template('home.html')

@app.route('/signin', methods=['GET', 'POST'])
def sign_in():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = SignInForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('sign_in'))
        login_user(user)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('signIn.html', title='Sign In', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = SignUpForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('index'))
    return render_template('signUp.html', title='Sign Up', form=form)

# TODO: add logout to nav bar
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/statistics')
def statistics():
    return render_template('statistics.html')

# send game stats to db -> to be moved to api section later (?)
# /<id>
@app.route('/gamestats', methods=['POST'])
def game_stats():
    data = request.get_json() or {}
    #print("game data:", data)
    game_stats = Game_Statistics() 
    game_stats.user_id = current_user.get_id()
    game_stats.date = datetime.strptime((data['date']),'%Y-%m-%dT%H:%M:%S.000Z').date()
    game_stats.completion_time = data['time']
    game_stats.win = data['gameOutcome']
    db.session.add(game_stats)
    db.session.commit()
    #response = jsonify(game_stats)
    #response.status_code = 201 #creating a new resource should chare the location.... - delete after
    return # to be completed 

@app.route('/puzzle', methods=['GET'])
def get_puzzle():
    puzzles = Puzzle.query.all()

    for puzzle in puzzles:
        if puzzle.date == datetime.today().strftime('%Y-%m-%d'):
            return json.dumps(puzzle.sharks_locations)
        
    todays_puzzle = generate_puzzle()
    db.session.add(todays_puzzle)
    db.session.commit()

    return json.dumps(todays_puzzle.sharks_locations)

def generate_puzzle():
    numTiles = 100
    numShark = 10

    sharks = []
    sharks_string = ""
    count = 0

    while (count < numShark):
        position = random.randint(0, numTiles - 1)
        if (position not in sharks):
            sharks.append(position)
            count = count + 1

    for shark in sharks:
        sharks_string += str(shark) + ","
    
    sharks_string = sharks_string.strip(",")
    
    puzzle = Puzzle()
    puzzle.sharks_locations = sharks_string
    puzzle.date = datetime.today().strftime('%Y-%m-%d')

    return puzzle
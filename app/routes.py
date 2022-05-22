from turtle import title
from flask import render_template, redirect, flash, url_for, request, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime

from app import app, db
from app.forms import SignInForm, SignUpForm, AdminUploadGameForm
from app.models import User, Game_Statistics, Puzzle

import random
import json

from werkzeug.urls import url_parse

@app.route('/')
@app.route('/index')
def index():
    return render_template('home.html', title='Shark Attack')

@app.route('/signin', methods=['GET', 'POST'])
def sign_in():
    # if user is already signed in - redirect it to game page
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
        # Redirect users who have signed in to game page
        return redirect(next_page)
    return render_template('signIn.html', title='Sign In', form=form)

#TODO: Once a user is signed up, make sure it's signed in and redirect to index
@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
    # if user is already signed in - redirect it to game page
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = SignUpForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return redirect(url_for('index'))
    return render_template('signUp.html', title='Sign Up', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/statistics')
def statistics():
    games = get_all_game_stats()
    individal_games = get_individual_game_stats(current_user.get_id())
    return render_template('statistics.html', title= 'Statistics', games=games, individal_games=individal_games)

#TODO: to be moved into contollers 
# returns all games statistics
def get_all_game_stats():
    rank = 1
    # Orders games by games won and their respective time
    games = Game_Statistics.query.order_by(Game_Statistics.win.desc(), Game_Statistics.completion_time.asc()).all()
    global_games = []
    
    if games is not None: 
        for g in games:
            if g.user_id is not None:
                username = User.query.filter_by(id = g.user_id).first().username
                date = g.date.strftime("%d/%m/%Y")
                global_games.append({'Rank': rank, 'Username': username, 'Date': date,
                                    'Time': g.completion_time, 'Win' : g.win })
                rank += 1
    
    return global_games

#TODO: to be moved into contollers 
# returns all games statistics for the currently signed in user
def get_individual_game_stats(id):
    rank = 1
    games = Game_Statistics.query.order_by(Game_Statistics.win.desc(), Game_Statistics.completion_time.asc()).filter_by(user_id=id).all()
    individual_games = []
    
    if games is not None: 
        for g in games:
            if g.user_id is not None:
                username = User.query.filter_by(id = id).first().username
                date = g.date.strftime("%d/%m/%Y")
                individual_games.append({'Rank': rank, 'Username': username, 'Date': date,
                                        'Time': g.completion_time, 'Win' : g.win })
                rank += 1
   
    return individual_games

#TODO: to be moved API (?) 
# Gets game statistics when the game is finished and stores them in the 'Game_Statistics' database
@app.route('/gamestats', methods=['POST'])
def game_stats():
    data = request.get_json() or {}
    game_stats = Game_Statistics() 
    game_stats.user_id = current_user.get_id()
    game_stats.date = datetime.strptime((data['date']),'%Y-%m-%dT%H:%M:%S.000Z').date()
    game_stats.completion_time = data['time']
    game_stats.win = data['gameOutcome']
    db.session.add(game_stats)
    db.session.commit()
    return data, 201  #Returns the game outcome data and 201 - resource created 

#TODO: to be moved API (?) 
# Gets todays puzzle sharks location from the 'Puzzle' database
@app.route('/puzzle', methods=['GET'])
def get_puzzle():
    puzzles = Puzzle.query.all()

    for puzzle in puzzles:
        if puzzle.date == datetime.today().strftime('%Y-%m-%d'):
            return json.dumps(puzzle.sharks_locations)
        
    # If todays date isn't in the database (locations hasn't been generated yet)
    # genertas today's puzzle shark location and store it in the 'Puzzle' database
    todays_puzzle = generate_puzzle()
    db.session.add(todays_puzzle)
    db.session.commit()

    return json.dumps(todays_puzzle.sharks_locations)

#TODO: to be moved to controllers (?)
# Generates a string with 10 numbers, each number represents a shark location
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

#TODO: to be moved API (?) & ONLY ADMIN ACCESS
# Stores admin created shark locations in the 'Puzzle' database
@app.route('/admin', methods=['GET', 'POST'])
def upload_puzzle():
    form = AdminUploadGameForm()
    if form.validate_on_submit():
        sharksLocations = '{},{},{},{},{},{},{},{},{},{}'.format(form.number_1.data,form.number_2.data,form.number_3.data,form.number_4.data,
                          form.number_5.data,form.number_6.data, form.number_7.data, form.number_8.data, form.number_9.data, form.number_10.data)
        # If there's a puzzle already stored for that date, delete it and overwrite it with new puzzle
        if db.session.query(Puzzle).filter(Puzzle.date == form.date.data) is not None:
            db.session.query(Puzzle).filter(Puzzle.date == form.date.data).delete()
        new_puzzle = Puzzle() 
        new_puzzle.date = form.date.data
        new_puzzle.sharks_locations = sharksLocations
        db.session.add(new_puzzle)
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('admin.html', title='Admin Centre', form=form)
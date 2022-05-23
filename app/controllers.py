from flask import render_template, redirect, flash, url_for, request
from flask_login import current_user, login_user, logout_user

from app import db
from app.forms import SignInForm, SignUpForm, AdminUploadGameForm
from app.models import User, Game_Statistics, Puzzle

from werkzeug.urls import url_parse

# Controller class for Users transactions (sign in, sign up & logout)
class UserController():
    def sign_in():
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

    def sign_up():
        form = SignUpForm()
        if form.validate_on_submit():
            user = User(username=form.username.data, email=form.email.data)
            user.set_password(form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(url_for('index'))
        return render_template('signUp.html', title='Sign Up', form=form)
    
    def logout():
        logout_user()
        return redirect(url_for('index'))

# Controller class for sending data from the db to the stats table
class StatsTableController():
    # returns all games statistics stored in the db
    def get_all_game_stats():
        rank = 1
        # Orders games by games won and time
        games = Game_Statistics.query.order_by(Game_Statistics.win.desc(), Game_Statistics.completion_time.asc()).all()
        global_games = []
        
        # Only send data if the user is not annonymous and already played at least one game
        if games is not None: 
            for g in games:
                if g.user_id is not None:
                    username = User.query.filter_by(id = g.user_id).first().username
                    date = g.date.strftime("%d/%m/%Y")
                    global_games.append({'Rank': rank, 'Username': username, 'Date': date,
                                        'Time': g.completion_time, 'Win' : g.win })
                    rank += 1
        
        return global_games

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
    
    def stat_table():
        games = StatsTableController.get_all_game_stats()
        individal_games = StatsTableController.get_individual_game_stats(current_user.get_id())
        return render_template('statistics.html', title= 'Statistics', games=games, individal_games=individal_games)

# Controller class for Admin transactions (generating new future puzzles/games)
class AdminController():
    def upload_puzzle():
        form = AdminUploadGameForm()
        if form.validate_on_submit():
            # formats the 10 numbers into a string - same as db format
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
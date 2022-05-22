from flask import render_template, redirect, flash, url_for
from flask_login import current_user

from app import app
from app.controllers import StatsTableController, AdminController, UserController

@app.route('/')
@app.route('/index')
# Returns the app home page (which is the game itself)
def index():
    return render_template('home.html', title='Shark Attack')

@app.route('/signin', methods=['GET', 'POST'])
def sign_in():
    # if user is already signed in - redirect them to game page
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    return UserController.sign_in()

@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
    # if user is already signed in - redirect them to game page
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    return UserController.sign_up()

# Log out users out of the applcation (after clicking on the sign out button)
@app.route('/logout')
def logout():
    return UserController.logout()

# Returns statistics table view
@app.route('/statistics')
def statistics():
    return StatsTableController.stat_table()

# Stores admin created puzzle (shark locations) in the 'Puzzle' database
@app.route('/admin', methods=['GET', 'POST'])
def admin_puzzle():
    # Only users with an admin rule can generate future puzzles
    if current_user.role != 'admin':
        flash('Admin access only')
        return redirect(url_for('index'))
    return AdminController.upload_puzzle()
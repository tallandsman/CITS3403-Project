from flask import render_template, redirect, flash, url_for, request
from flask_login import current_user, login_user, logout_user, login_required

from app import app, db
from app.forms import SignInForm, SignUpForm
from app.models import User

from werkzeug.urls import url_parse

# TODO: add comments
@app.route('/')
@app.route('/index')
@login_required # TODO: Decide if we want unathenticatd (non-users) to be able to play the game -> if yes form() needs to be changed
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
            return redirect(url_for('signin'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('signIn.html', title='Sign In', form=form)

@app.route('/signup')
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

# TODO: add logout to nav bar or somewhere else in the application
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))
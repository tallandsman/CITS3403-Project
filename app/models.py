from app import db, login
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# table to store new user details
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64), default='player')
    registerDate = db.Column(db.DateTime, default=datetime.today)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    # generates a password hash - the original password isn't stored 
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # verifies password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# table to store game stats
class Game_Statistics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.DateTime, default=datetime.date)
    completion_time = db.Column(db.DateTime, nullable=False)
    win = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Game id {}>'.format(self.id)

# able to store previous sharkattack games
class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # to be completed #

    def __repr__(self):
        return # to be completed #

# to delete after testing (?)
@login.user_loader
def load_user(id):
    return User.query.get(int(id))
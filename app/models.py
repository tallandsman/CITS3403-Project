from app import db
from datetime import datetime

# table to store new user details
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64), default='player')
    registerDate = db.Column(db.DateTime, default=datetime.date)

    def __repr__(self):
        return '<User {}>'.format(self.username)

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
from app import db, login
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

import base64
import os

# table to store users details
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64), default='player') # either player or admin
    registerDate = db.Column(db.DateTime, default=datetime.today)
    # token authentication to be used with token API
    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    # generates a password hash - the original password isn't stored in the db
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # verifies password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # generates token and store it in the db
    def get_token(self, expires_in=3600):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token
        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        return self.token
    
    # revokes a user's toekn - used in the token API
    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)
    
    # checks if the user's token is valid
    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user

# table to store game statistics
class Game_Statistics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.DateTime, default=datetime.today().date())
    completion_time = db.Column(db.Float, nullable=False)
    win = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Game id {}>'.format(self.id)

# table to store sharks location for each daily puzzle
class Puzzle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(120))
    sharks_locations = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return '<Puzzle date {}, Sharks_locations{}>'.format(self.date, self.sharks_locations)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))
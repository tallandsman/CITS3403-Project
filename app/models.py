from app import db, login
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# table to store users details
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(64), default='player') # either player or admin
    registerDate = db.Column(db.DateTime, default=datetime.today)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    # generates a password hash - the original password isn't stored in the table
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # verifies password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
from app import app, db
from app.models import User, Game_Statistics, Puzzle


# for testing purposes - can use with "flask shell" 
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Game_Statistics': Game_Statistics, 'Puzzle': Puzzle}
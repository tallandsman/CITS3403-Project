from flask import  request
from flask_login import current_user
from datetime import datetime

from app import app, db
from app.models import Game_Statistics

# Uploads the current user game stats into the database using the data received from the AJAX request
@app.route('/gamestats', methods=['POST'])
def game_stats():
    data = request.get_json() or {}
    
    # Gets today's game stats data for the current user
    current_user_data = db.session.query(Game_Statistics).filter((Game_Statistics.user_id == current_user.get_id()) & 
                                        (Game_Statistics.user_id == current_user.get_id())).all()

    """ only records the first game results into the db
        for any further games played, stats are not recorded in the db """
    if current_user_data is not None and current_user_data != []:
        return data,304

    game_stats = Game_Statistics() 
    game_stats.user_id = current_user.get_id()
    game_stats.date = datetime.strptime((data['date']),'%Y-%m-%dT%H:%M:%S.000Z').date()
    game_stats.completion_time = data['time']
    game_stats.win = data['gameOutcome']
    db.session.add(game_stats)
    db.session.commit()
    return data, 201  # Returns the game outcome data and 201 - resource created 
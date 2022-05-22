from datetime import datetime

from app import app, db
from app.models import Puzzle

import json
import random 

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
    

# Gets todays puzzle sharks location from the 'Puzzle' database
@app.route('/puzzle', methods=['GET'])
def get_puzzle():
    puzzles = Puzzle.query.all()

    for puzzle in puzzles:
        if puzzle.date == datetime.today().strftime('%Y-%m-%d'):
            return json.dumps(puzzle.sharks_locations)
        
    # If todays date isn't in the database (locations hasn't been generated yet)
    # generate today's puzzle shark location and store it in the 'Puzzle' database
    todays_puzzle = generate_puzzle()
    db.session.add(todays_puzzle)
    db.session.commit()

    return json.dumps(todays_puzzle.sharks_locations)
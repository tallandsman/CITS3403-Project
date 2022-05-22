from flask import jsonify
from app import app, db
from app.api.auth import basic_auth, token_auth

@app.route('/tokens', methods=['POST'])
@basic_auth.login_required
# API to get users token
def get_token():
    token = basic_auth.current_user().get_token()
    db.session.commit()
    return jsonify({'token': token})

@app.route('/tokens', methods=['DELETE'])
@basic_auth.login_required
# API to delete users token
def revoke_token():
    token_auth.current_user().revoke_token()
    db.session.commit()
    return '', 204

# Reference: The Flask Mega-Tutorial by Miguel Grinberg
# https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xxiii-application-programming-interfaces-apis
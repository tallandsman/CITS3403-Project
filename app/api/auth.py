from flask import jsonify
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

@basic_auth.verify_password
# Verifies password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user

@basic_auth.error_handler
# Throws an error if password can't be authenticate
def basic_auth_error():
    response = jsonify({'message':'Unknown Error'})
    return response, 401

@token_auth.verify_token
# Verifies token
def verify_token(token):
    return User.check_token(token) if token else None

@token_auth.error_handler
# Throws an error if token can't be authenticate
def token_auth_error():
    response = jsonify({'message':'Unknown Error'})
    return response, 401

# Reference: The Flask Mega-Tutorial by Miguel Grinberg
# https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-xxiii-application-programming-interfaces-apis
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, IntegerField, DateField, validators
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, NumberRange
from app.models import User
import datetime

# Class to hold fields for sign in page
class SignInForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')

# Class to hold fields for sign up page
class SignUpForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField('Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Submit')

    # No duplicate usernames
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Please use a different username.')
    
    # No duplicate emails
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user is not None:
            raise ValidationError('Please use a different email address.')

# Class to hold fields for admin form page
class AdminUploadGameForm(FlaskForm):
    number_1 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_2 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_3 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_4 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_5 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_6 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_7 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_8 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_9 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    number_10 = IntegerField('', validators=[DataRequired(),validators.NumberRange(min=0, max=99)])
    date = DateField('Date',validators=[DataRequired()])
    submit = SubmitField('Submit')
    
    # Validates the date - not today or in the past as admin can only upload future puzzles
    def validate_date(form, date):
        if date.data <= datetime.date.today():
            raise ValidationError("The date cannot be today or in the past!")
    
    # Validates that all 10 different numbers are unique - as each shark location is unique
    def validate_submit(form, submit):
        input_numbers = [form.number_1.data, form.number_2.data, form.number_3.data, form.number_4.data, form.number_5.data, form.number_6.data,
                         form.number_7.data, form.number_8.data, form.number_9.data, form.number_10.data]

        for num in input_numbers:
            if input_numbers.count(num) > 1:
                raise ValidationError("All 10 numbers have to be unique!")
                
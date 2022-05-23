# test_module.py
import unittest, os

from flask_login import current_user, login_user, logout_user, login_required
from datetime import datetime
from app import app, db, login
from app.forms import SignInForm, SignUpForm, AdminUploadGameForm
from app.models import User, Game_Statistics, Puzzle

class userModel(unittest.TestCase):
    def setup(self):
        basedir=os.path.abspath(os.path.dirnane(__file__))
        app.config['SQLALCHEMY DATABASE URI']=\
            'sqlite:///'+os.path.join(basedir, 'test.db')
        self.app = app.test_client()
        db.create_all()
        u1 = User(id='000', username='Test', email='Test@test.com', password_hash='1234', role='player', registerDate=datetime.today)
        u1 = User(id='111', username='Unit', email='Unit@test.com', password_hash='5678', role='player', registerDate=datetime.today)

        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_sign_in():
        sign_in(form.username.label = 'Test', form.password.label = '1234').current_user.is_anonymous = False
        sign_in(form.username.label = 'Unit', form.password.label = '5678').current_user.is_anonymous = False
        # Not existing user info
        sign_in(form.username.label = 'worng' form.password.label = '0000').current_user.is_anonymous = True
    
    def test_sign_up(self):
        u = User.query.get('000')
        self.assertEqual(u.username, 'Test')
        self.driver.get('http://localhost:5000/signup')
        self.driver.implicitly_wait(5)
        num_field = self.driver.find_element_by_id('username')
        num_field.send_keys("000")
        email = self.driver.find_element_by_id('email')
        email.send_keys("test@test.com")
        new_pin = self.driver.find_element_by_id('new_pin')
        new_pin.send_keys("000")
        new_pin2 = self.driver.find_element_by_id('new_pin2')
        new_pin2.send_keys("000")
        time.sleep(1)
        self.driver.implicitly_wait(5)
        submit = self.driver.find_element_by_id('submit')
        submit.click()

        self.driver.implicitly_wait(5)
        time.sleep(1)
        logout = self.driver.find_element_by_partial_link_text('logout')

        sign_up(username='testuser', email='testuser@test.com', password='testpassword')

    def test_logout():
        logout_user().current_user.is_anonymous = True

    def test_upload_puzzle():
        sharksLocations = '{1},{2},{3},{4},{5},{6},{7},{8},{9},{10}'


if __name__ == '__main__':
    unittest.main()

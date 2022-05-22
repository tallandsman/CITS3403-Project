# CITS3403-Project
## Title
Shark Attack - web-application of a minesweeper clone

## Description
	Shark Attack is a web-application game in which the user will use deductive reasoning to solve the daily minesweeper puzzle. The application is build using a standard HTML/CSS/Bootstrap/JS front-end and a flask python backend with a SQLite database. AJAX and jQuery is used to interface between the front and back ends of the web-app. These technologies were chosen by instruction of our unit coordinator as they allow us to become familiar with the fundamentals of end-to-end web-developement.

	The project was developed using the Agile-Scrum system of project management. Bi-weekly meetings were attended with full comprehensive minutes written, documenting the tasks each developer was assigned to complete before the following meeting. 

	Throughout this project some of the major problems that we encountered were as follows:
		- handling the tedious (and sometimes unintuitive) styling of the front end.
		- ensuring the project is responsive across both devices and browsers.
		- implementing strong authentication for the User-Admin system.

## Prerequisities
Requires python3, flask, venv, and sqlit

## Installation:
Within the project directory:
1. Create and set-up the virtual environment:
- create a virtual environment using the virtualenv package `python3 -m venv venv`
- activate the newly created environment `source venv/bin/activate`
- Install all of the requirements `pip3 install -r requirements.txt`

2. Create the flask databases:
- Build the database using `flask db init`

3. Run the application:
- `flask run`

Once running, the application should be accessible on **localhost** on port 5000
- http://localhost:5000/index

## Executing Tests

## Deployment
via localhost

## Authors
* **Alison Jeon** (22835304)
* **Tal Landsman** (22981003)
* **Jordan Thompson-Giang** (22729642)

## Acknowledgments
* Built following the [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world) by **Miguel Grinberg**.

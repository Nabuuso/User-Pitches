from flask import Flask,render_template,flash,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY']="Abcd1234!@#$%^&*()EFGH"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://nabuusu:12345@localhost/pitches'
db = SQLAlchemy(app)
migrate = Migrate(app,db)

class User(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    full_name = db.Column(db.String(200),nullable=False)
    email = db.Column(db.String(200),nullable=False,unique=True)
    password = db.Column(db.String(200),nullable=False)
    created_date = db.Column(db.DateTime,default=datetime.utcnow)
    def __init__(self,full_name,email,password):
        self.full_name = full_name
        self.email = email
        self.password = password
    def __repr__(self):
        return '<Name %r>' % self.full_name

@app.route('/index')
@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"),404

@app.errorhandler(500)
def page_not_found(e):
    return render_template("500.html"),500
@app.route('/register')
def register():
    return render_template("registration.html")
@app.route('/users',methods=['POST'])
def users():
    full_name = request.form['full_name']
    email = request.form['email']
    password = request.form['password']
    user = User(full_name=full_name,email=email,password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'name':full_name,'email':email,password:'password'})

if __name__ == '__main__':
    db.create_all()
    app.run()
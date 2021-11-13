from flask import Flask,render_template,flash,request,jsonify,redirect,url_for
from flask_wtf import FlaskForm
from wtforms import StringField,SubmitField
from wtforms.fields.simple import PasswordField
from wtforms.validators import DataRequired
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import UserMixin,login_user,LoginManager,login_required,logout_user,current_user

app = Flask(__name__)
app.config['SECRET_KEY']="Abcd1234!@#$%^&*()EFGH"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://nabuusu:12345@localhost/pitches'
db = SQLAlchemy(app)
migrate = Migrate(app,db)

#Flask login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
##User model
class User(db.Model,UserMixin):
    id = db.Column(db.Integer,primary_key=True)
    full_name = db.Column(db.String(200),nullable=False)
    email = db.Column(db.String(200),nullable=False,unique=True)
    password_hash = db.Column(db.String(200))
    created_date = db.Column(db.DateTime,default=datetime.utcnow)
    pitches = db.relationship('Pitch',backref="user_pitch")
    # def __init__(self,full_name,email,password):
    #     self.full_name = full_name
    #     self.email = email
    #     self.password = password
    
    @property
    def password(self):
        raise AttributeError('Password is not a readable attribute')
    @password.setter
    def password(self,password):
        self.password_hash = generate_password_hash(password)
    def verify_password(self,password):
        return check_password_hash(self.password_hash,password)
    def __repr__(self):
        return '<Name %r>' % self.full_name
class PitchCategory(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    category_name = db.Column(db.String(200),nullable=False)
    created_date = db.Column(db.DateTime,default=datetime.utcnow)
    pitches = db.relationship('Pitch',backref="cat_pitch")
class Pitch(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String(200),nullable=False)
    description = db.Column(db.Text)
    created_date = db.Column(db.DateTime,default=datetime.utcnow)
    upvote = db.Column(db.Integer)
    downvote = db.Column(db.Integer)
    category_id = db.Column(db.Integer,db.ForeignKey('pitch_category.id'))
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
class Comment(db.Model):
    id = db.Column(db.Integer,primary_key=True)
class LoginForm(FlaskForm):
    email = StringField("Email address", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")
###INDEX & LOGIN PAGE
@app.route('/index',methods=['GET','POST'])
def index():
    form = LoginForm('/index')
    if(request.method == 'POST'):
        print('login')
        if form.validate_on_submit():
            user = User.query.filter_by(email = form.email.data).first()
            if user:
                if check_password_hash(user.password_hash,form.password.data):
                    login_user(user)
                    # flash("Login successfully")
                    print('success')
                    # return jsonify({'name':user.full_name,'email':user.email})
                    return redirect(url_for('dashboard'))
                else:
                    flash("Wrong password - Try again")
            else:
                flash("That user does not exist, try again!")
    # return jsonify({'name':'Muuyi','email':'Andrew'})
    return render_template("index.html",form=form)
###LOGIN FORM
##LOGOUT PAGE
@app.route('/logout',methods=['GET','POST'])
@login_required
def logout():
    logout_user()
    flash("You have successfully logged out!")
    return redirect(url_for('login'))
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"),404

@app.errorhandler(500)
def page_not_found(e):
    return render_template("500.html"),500
@app.route('/register')
def register():
    return render_template("registration.html")

##########USERS SECTION
@app.route('/users',methods=['POST'])
def users():
    full_name = request.form['full_name']
    email = request.form['email']
    hashed_password = generate_password_hash(request.form['password'],"sha256")
    user = User(full_name=full_name,email=email,password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()
    return redirect(url_for('dashboard'))
###########PITCH CATEGORIES
@app.route('/pitch-categories',methods=['POST','GET'])
def pitch_categories():
    if request.method == 'POST':
        # categories = PitchCategory.query.
        category_name = request.form['category_name']
        cat = PitchCategory(category_name=category_name)
        db.session.add(cat)
        db.session.commit()
        return redirect(url_for('dashboard'))
    elif request.method == 'GET':
        categories = PitchCategory.query.order_by(PitchCategory.created_date.desc()).all()
        lst = [{"id":cat.id,"name":cat.category_name,"created_date":cat.created_date} for cat in categories]
        results = jsonify(lst)
        return results

########DASHBOARD SECTION
@app.route('/dashboard',methods=['GET','POST'])
@app.route('/',methods=['GET','POST'])
# @login_required
def dashboard():
    return render_template('all_pitches.html')

##Load categories page
@app.route('/categories')
def categories():
    return render_template('categories.html')

##Load my pitches
@app.route('/pitches')
def pitches():
    return render_template('/pitches.html')
##PITCH POSTS
@app.route('/pitch-content',methods=['POST','GET'])
def pitch_content():
    if request.method == 'POST':
        # categories = PitchCategory.query.
        title = request.form['title']
        description = request.form['description']
        upvote=0
        downvote=0
        category_id = request.form['category']
        user_id = request.form['user']
        pitch = Pitch(title=title,description=description,upvote=upvote,downvote=downvote,category_id=category_id,user_id=user_id)
        db.session.add(pitch)
        db.session.commit()
        return ('Pitch created successfully')
    elif request.method == 'GET':
        pitches = Pitch.query.order_by(Pitch.created_date.desc()).all()
        lst = [{"id":p.id,"title":p.title,"category":p.category_id,"description":p.description,"upvote":p.upvote,"downvote":p.downvote,"created_date":p.created_date} for p in pitches]
        results = jsonify(lst)
        return results
##UPVOTE
@app.route('/upvote/<int:id>',methods=['GET','POST'])
def upvote(id):
    pitch = Pitch.query.get_or_404(id)
    pitch.upvote += 1
    db.session.add(pitch)
    db.session.commit()
    return {"upvote":pitch.upvote}
##DOWNVOTE
@app.route('/downvote/<int:id>',methods=['GET','POST'])
def downvote(id):
    pitch = Pitch.query.get_or_404(id)
    pitch.downvote += 1
    db.session.add(pitch)
    db.session.commit()
    return {"downvote":pitch.downvote}
if __name__ == '__main__':
    db.create_all()
    app.run()

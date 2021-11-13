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
    comments = db.relationship('Comment',backref="user_comments")
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
    comments = db.relationship('Comment',backref="pitch_comments")
class Comment(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    description = db.Column(db.Text)
    created_date = db.Column(db.DateTime,default=datetime.utcnow)
    pitch_id = db.Column(db.Integer,db.ForeignKey('pitch.id'))
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
class LoginForm(FlaskForm):
    email = StringField("Email address", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")
###INDEX & LOGIN PAGE
@app.route('/index',methods=['GET','POST'])
def index():
    form = LoginForm()
    if(request.method == 'POST'):
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user:
                try:
                    print(user.password_hash)
                    print(form.password.data)
                    login_user(user)
                    return redirect(url_for('dashboard'))
                    # if check_password_hash(user.password_hash,form.password.data):
                    #     print(user.password_hash)
                    #     login_user(user)
                    #     # flash("Login successfully")
                    #     print(user)
                    #     print('success')
                    #     # return jsonify({'name':user.full_name,'email':user.email})
                    #     return redirect(url_for('dashboard'))
                    # else:
                    #     flash("Wrong password - Try again")
                except Exception as e:
                    raise(e)
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
    # flash("You have successfully logged out!")
    return redirect(url_for('dashboard'))
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
##FILTER PITCHES
@app.route('/pitch-content/<int:id>',methods=['GET','POST'])
def get_pitches(id):
    pitches = Pitch.query.order_by(Pitch.created_date.desc()).filter_by(category_id=id)
    lst = [{"id":p.id,"title":p.title,"category":p.category_id,"description":p.description,"upvote":p.upvote,"downvote":p.downvote,"created_date":p.created_date} for p in pitches]
    results = jsonify(lst)
    return results
##CLIENT PITCHES
@app.route('/client-pitch/<int:id>',methods=['GET','POST'])
def get_client_pitches(id):
    pitches = Pitch.query.order_by(Pitch.created_date.desc()).filter_by(user_id=id)
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
##COMMENTS
@app.route('/comments',methods=['POST','GET'])
def comments():
    if request.method == 'POST':
        # categories = PitchCategory.query.
        description = request.form['description']
        pitch = request.form['pitch']
        user = request.form['user']
        comment = Comment(description=description,pitch_id=pitch,user_id=user)
        db.session.add(comment)
        db.session.commit()
        return redirect(url_for('dashboard'))
    elif request.method == 'GET':
        comments = Comment.query.order_by(Comment.created_date.desc()).all()
        lst = []
        for c in comments:
            user = User.query.get_or_404(c.user_id)
            username = ""
            if user:
                username = user.full_name
            else:
                
            lst.push({"id":c.id,"description":c.description,"created_date":c.created_date,"pitch":c.pitch_id,"user":c.user_id,"username":user.full_name})
        results = jsonify(lst)
        return results
##GET COMMES
@app.route('/comments/<int:id>',methods=['GET','POST'])
def get_comments(id):
    comments = Comment.query.order_by(Comment.created_date.desc()).filter_by(pitch_id=id)
    lst = [{"id":c.id,"description":c.description,"created_date":c.created_date,"pitch":c.pitch_id,"user":c.user_id} for c in comments]
    results = jsonify(lst)
    return results
if __name__ == '__main__':
    db.create_all()
    app.run()

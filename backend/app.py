
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/balsadan'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Orphan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)
    medical_condition = db.Column(db.String(255))
    education_level = db.Column(db.String(100))
    background = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    is_adopted = db.Column(db.Boolean, default=False)

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donor_name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    donation_date = db.Column(db.DateTime, default=datetime.utcnow)
    donation_type = db.Column(db.String(50), nullable=False)
    purpose = db.Column(db.String(255))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)

# Authentication Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    admin = Admin.query.filter_by(username=username).first()
    
    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    return jsonify({'success': True, 'username': admin.username}), 200

# Orphan Routes
@app.route('/api/orphans', methods=['GET'])
def get_orphans():
    orphans = Orphan.query.all()
    result = []
    
    for orphan in orphans:
        result.append({
            'id': orphan.id,
            'name': orphan.name,
            'age': orphan.age,
            'gender': orphan.gender,
            'date_joined': orphan.date_joined,
            'medical_condition': orphan.medical_condition,
            'education_level': orphan.education_level,
            'is_adopted': orphan.is_adopted,
            'photo_url': orphan.photo_url
        })
        
    return jsonify(result)

@app.route('/api/orphans/<int:orphan_id>', methods=['GET'])
def get_orphan(orphan_id):
    orphan = Orphan.query.get_or_404(orphan_id)
    return jsonify({
        'id': orphan.id,
        'name': orphan.name,
        'age': orphan.age,
        'gender': orphan.gender,
        'date_joined': orphan.date_joined,
        'medical_condition': orphan.medical_condition,
        'education_level': orphan.education_level,
        'background': orphan.background,
        'is_adopted': orphan.is_adopted,
        'photo_url': orphan.photo_url
    })

@app.route('/api/orphans', methods=['POST'])
def add_orphan():
    data = request.json
    new_orphan = Orphan(
        name=data['name'],
        age=data['age'],
        gender=data['gender'],
        medical_condition=data.get('medical_condition', ''),
        education_level=data.get('education_level', ''),
        background=data.get('background', ''),
        photo_url=data.get('photo_url', ''),
        is_adopted=data.get('is_adopted', False)
    )
    
    db.session.add(new_orphan)
    db.session.commit()
    
    return jsonify({'id': new_orphan.id, 'message': 'Orphan added successfully'}), 201

@app.route('/api/orphans/<int:orphan_id>', methods=['PUT'])
def update_orphan(orphan_id):
    orphan = Orphan.query.get_or_404(orphan_id)
    data = request.json
    
    orphan.name = data.get('name', orphan.name)
    orphan.age = data.get('age', orphan.age)
    orphan.gender = data.get('gender', orphan.gender)
    orphan.medical_condition = data.get('medical_condition', orphan.medical_condition)
    orphan.education_level = data.get('education_level', orphan.education_level)
    orphan.background = data.get('background', orphan.background)
    orphan.is_adopted = data.get('is_adopted', orphan.is_adopted)
    orphan.photo_url = data.get('photo_url', orphan.photo_url)
    
    db.session.commit()
    
    return jsonify({'message': 'Orphan updated successfully'})

@app.route('/api/orphans/<int:orphan_id>', methods=['DELETE'])
def delete_orphan(orphan_id):
    orphan = Orphan.query.get_or_404(orphan_id)
    
    db.session.delete(orphan)
    db.session.commit()
    
    return jsonify({'message': 'Orphan deleted successfully'})

# Donation Routes
@app.route('/api/donations', methods=['GET'])
def get_donations():
    donations = Donation.query.all()
    result = []
    
    for donation in donations:
        result.append({
            'id': donation.id,
            'donor_name': donation.donor_name,
            'amount': donation.amount,
            'donation_date': donation.donation_date,
            'donation_type': donation.donation_type,
            'purpose': donation.purpose,
            'email': donation.email,
        })
        
    return jsonify(result)

@app.route('/api/donations', methods=['POST'])
def add_donation():
    data = request.json
    new_donation = Donation(
        donor_name=data['donor_name'],
        amount=data['amount'],
        donation_type=data['donation_type'],
        purpose=data.get('purpose', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        address=data.get('address', '')
    )
    
    db.session.add(new_donation)
    db.session.commit()
    
    return jsonify({'id': new_donation.id, 'message': 'Donation added successfully'}), 201

# Member Routes
@app.route('/api/members', methods=['GET'])
def get_members():
    members = Member.query.all()
    result = []
    
    for member in members:
        result.append({
            'id': member.id,
            'name': member.name,
            'role': member.role,
            'phone': member.phone,
            'email': member.email,
            'joined_date': member.joined_date
        })
        
    return jsonify(result)

@app.route('/api/members', methods=['POST'])
def add_member():
    data = request.json
    new_member = Member(
        name=data['name'],
        role=data['role'],
        phone=data['phone'],
        email=data['email']
    )
    
    db.session.add(new_member)
    db.session.commit()
    
    return jsonify({'id': new_member.id, 'message': 'Member added successfully'}), 201

@app.route('/api/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    member = Member.query.get_or_404(member_id)
    data = request.json
    
    member.name = data.get('name', member.name)
    member.role = data.get('role', member.role)
    member.phone = data.get('phone', member.phone)
    member.email = data.get('email', member.email)
    
    db.session.commit()
    
    return jsonify({'message': 'Member updated successfully'})

@app.route('/api/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    member = Member.query.get_or_404(member_id)
    
    db.session.delete(member)
    db.session.commit()
    
    return jsonify({'message': 'Member deleted successfully'})

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    orphan_count = Orphan.query.count()
    adopted_count = Orphan.query.filter_by(is_adopted=True).count()
    total_donations = db.session.query(db.func.sum(Donation.amount)).scalar() or 0
    recent_donations = Donation.query.order_by(Donation.donation_date.desc()).limit(5).all()
    
    return jsonify({
        'orphan_count': orphan_count,
        'adopted_count': adopted_count,
        'total_donations': total_donations,
        'recent_donations': [{
            'id': d.id,
            'donor_name': d.donor_name,
            'amount': d.amount,
            'donation_date': d.donation_date,
            'donation_type': d.donation_type
        } for d in recent_donations]
    })

# Create a default admin user
def create_default_admin():
    admin = Admin.query.filter_by(username='admin').first()
    if not admin:
        admin = Admin(username='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Default admin created: username=admin, password=admin123")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_default_admin()
    app.run(debug=True)

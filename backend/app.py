
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:password@localhost/balsadan'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
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

# Routes
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

#utils/auth_decorator.py
from functools import wraps
from flask import request, jsonify
import jwt
from config import Config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        secret_key = Config.SECRET_KEY

        if not secret_key:
            return jsonify({'error': 'Server configuration error'}), 500

        try:
            data = jwt.decode(
                token,
                secret_key,
                algorithms=['HS256']
            )

            current_user_id = data['user_id']

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401

        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user_id, *args, **kwargs)

    return decorated
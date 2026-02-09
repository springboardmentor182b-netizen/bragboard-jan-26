def signup_user(data):
    # TODO: connect database later
    return {
        "message": "User registered successfully",
        "email": data.email
    }


def login_user(data):
    # TODO: verify user from database later
    return {
        "message": "Login successful",
        "email": data.email
    }
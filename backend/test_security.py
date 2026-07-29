from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

password = "mypassword123"

hashed = hash_password(password)

print("Hashed Password:")
print(hashed)

print()

print("Password Match:")
print(verify_password(password, hashed))

print()

token = create_access_token({"sub": "abc@gmail.com"})

print("JWT Token:")
print(token)
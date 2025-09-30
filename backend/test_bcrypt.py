try:
    import bcrypt
    print("✅ bcrypt importa correctamente")
    
    # Probar funcionalidad
    password = "test123"
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    print("✅ Hash funciona:", hashed)
    
    check = bcrypt.checkpw(password.encode(), hashed)
    print("✅ Verificación funciona:", check)
    
except Exception as e:
    print("❌ Error:", e)
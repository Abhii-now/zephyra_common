# Zephyra Backend

## Overview

This README provides an overview of the Zephyra backend, including the database structure, usage of Docker, AES encryption, security measures, and setup instructions.

## Database Structure

The database is designed to store user information, transactions, and other relevant data. The main tables include:

- **Users**: Stores user details such as username, email, and password (encrypted).
- **Transactions**: Records all transactions made by users.
- **Products**: Contains information about the products available in the system.

## Docker Usage

The backend is containerized using Docker to ensure a consistent development and production environment.

### Building the Docker Image

```sh
docker build -t zephyra_backend .
```

### Running the Docker Container

```sh
docker run -d -p 8000:8000 --name zephyra_backend_container zephyra_backend
```

## AES Encryption

AES (Advanced Encryption Standard) is used to encrypt sensitive data such as user passwords and transaction details.

### Encrypting Data

```python
from Crypto.Cipher import AES
import base64

def encrypt(data, key):
   cipher = AES.new(key, AES.MODE_EAX)
   nonce = cipher.nonce
   ciphertext, tag = cipher.encrypt_and_digest(data.encode('utf-8'))
   return base64.b64encode(nonce + ciphertext).decode('utf-8')
```

### Decrypting Data

```python
def decrypt(data, key):
   data = base64.b64decode(data)
   nonce = data[:16]
   ciphertext = data[16:]
   cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
   plaintext = cipher.decrypt(ciphertext)
   return plaintext.decode('utf-8')
```

## Security Measures

- **Password Encryption**: User passwords are encrypted using AES before storing in the database.
- **Environment Variables**: Sensitive information such as encryption keys and database credentials are stored in environment variables.
- **HTTPS**: All communications between the client and server are secured using HTTPS.

## Setup Instructions

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/zephyra_backend.git
   cd zephyra_backend
   ```

2. **Set Up Environment Variables**
   Create a `.env` file and add the necessary environment variables:

   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   ENCRYPTION_KEY=your_encryption_key
   ```

3. **Build and Run Docker Container**

   ```sh
   docker build -t zephyra_backend .
   docker run -d -p 8000:8000 --name zephyra_backend_container zephyra_backend
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:8000`.

## Conclusion

This README provides a comprehensive guide to understanding and setting up the Zephyra backend. For further details, refer to the project documentation or contact the development team.

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
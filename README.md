# Zephyra

## Introduction

Zephyra is a comprehensive enterprise solution designed to streamline file sharing and document viewing within organizations. Leveraging a robust client-server architecture, Zephyra combines the power of React and Redux on the frontend with Django, Python, and SQLite on the backend. This integration ensures a seamless and efficient user experience, catering scalable solution to meet your enterprise needs.

## Features

- **Frontend**: Built with React and Redux for a responsive and dynamic user interface.
- **Backend**: Powered by Django, Python, and SQLite for robust and scalable performance.
- **Document Viewing**: Supports multiple document formats including PDF, DOCX, XLSX, and more.
- **Permissions**: Viewing options are based on user permissions, ensuring secure access control.
- **Security**: Integrated with Okta for authentication and uses Multi-Factor Authentication (MFA) for enhanced security.
- **Encryption**: Utilizes AES-256 encryption for end-to-end encrypted file sharing and storage.
- **Setup**: Simple setup procedure using Docker Compose for easy deployment.
- **Custom Certificates**: Users can provide their own SSL/TLS certificates for secure communication.

## Setup

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/zephyra.git
   cd zephyra
   ```

2. **Run Docker Compose**:

   ```sh
   docker-compose up
   ```

3. **Access the application**:
   Open your browser and navigate to `https://localhost:3000`.

## Security

Zephyra is integrated with Okta as a security provider, ensuring secure authentication and authorization. It uses Multi-Factor Authentication (MFA) to provide an additional layer of security, protecting against unauthorized access. Additionally, Zephyra employs AES-256 encryption to ensure end-to-end encrypted file sharing and storage.

## Custom Certificates

Users can provide their own SSL/TLS certificates to use the application securely. To do this, place your certificates in the `certs` directory and update the configuration file to point to your custom certificates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Contact

For any questions, issues, or support, please contact us at support@zephyra.com. We are here to help!

## Additional Resources

- **Documentation**: Detailed documentation is available in the `docs` directory.
- **Issue Tracker**: Report bugs or request features using the [GitHub Issues](https://github.com/yourusername/zephyra/issues) page.
- **Community Forum**: Join our community forum for discussions and support.

## Support

For any questions, issues, or support, please contact us at:

- **Email**: jainabhinav2k16@gmail.com

We are here to help!

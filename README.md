# **File Cryptographer**

## Overview

The File Cryptographer is a command-line tool that allows you to encrypt and decrypt files using a straightforward interface. This tool provides an added layer of security to your files by encrypting them with a user-defined password.

### **Example of the encryption process:**
  <p align="center">
    <img src="https://raw.githubusercontent.com/marcoulakis/FileCryptographer/main/assets/encrypt.gif" alt="Example of encrypt gif" height="auto" width="500" align="center"/>
  </p>

### **Example of the decryption process:**

  <p align="center">
    <img src="https://raw.githubusercontent.com/marcoulakis/FileCryptographer/main/assets/decrypt.gif" alt="Example of encrypt gif" height="auto" width="500" align="center"/>
  </p>

## Prerequisites

Before you can start using this repository, ensure that you have the following installed:

- Node.js
- Expo CLI
- Yarn

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine:
```
git clone https://github.com/marcoulakis/FileCryptographer.git
```

2. Navigate to the project directory:
```
cd FileCryptographer
```

3. Install the project dependencies:
```
yarn install
```

4. Run the program:

```
yarn start
```

## App Usage

### Choose the method:

- To encrypt a file, type "e" and press Enter. Then provide the path to the file you want to encrypt when prompted.

- To decrypt a file, type "d" and press Enter. Then provide the path to the file you want to decrypt when prompted.

### Find the file and crypt it:

- After providing the file path, you will be asked to enter a password for encryption or decryption. Enter your desired password and press Enter.

> The File Cryptographer will perform the requested operation
> and generate a new encrypted or decrypted file in the same
> directory as the original file. The new file will have the
> same name with the additional ".ecp" extension for encryption.

Once the process is complete, the program will display a success message along with the path to the newly generated file.

> **Warning**
> When you encrypt a file, the original one is PERMANENT DELETED
> automatically. If you wanna make sure that you don't want to lose original
> note your password and make a backup of the original file

## License

This project is licensed under the [MIT License](LICENSE).


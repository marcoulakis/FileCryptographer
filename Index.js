const cryptoJs = require('crypto');
const fs = require('fs');
const inquirer = require('inquirer')


const questions = [
    {
      type: 'input',
      name: 'type',
      message: "If you want to encrypt type 'e' and if you want to decrypt type 'd': "
    },
    {
        type: 'input',
        name: 'filePath',
        message: "What's the path of the file?"
    },
    {
        type: 'input',
        name: 'secret',
        message: "Type the secret phrase: "
      },
  ]


const askQuestions = async () => {
    const response = await inquirer.prompt(questions).then(option => {
        if(option.type.toLowerCase().trim() === 'e'){
            return option
        }
        if(option.type.toLowerCase().trim() === 'd'){
            return option;
        }
        return { type: null, filePath: option.filePath};
    })
    return response;
}

const app = async () => {
    const { type, filePath, secret } = await askQuestions()
    
    if(!type){
        console.error("\x1b[33m\x1b[41m", 'Invalid type !!!')
        console.log("\x1b[0m")
        console.warn("\x1b[43m\x1b[31m", 'Options are "e" and "d" ')
        console.log("\x1b[0m")

        return 
    }
    if(!filePath){
        console.error("\x1b[33m\x1b[41m", 'Type a path to the file.')
        console.log("\x1b[0m")
        return
    }
    if(!secret){
        console.error("\x1b[33m\x1b[41m", 'Type a secret phrase to the file.')
        console.log("\x1b[0m")
    }
    if(type.toLowerCase().trim() === 'e'){
        encrypt(filePath, secret)
    }else{
        decrypt(filePath, secret)
    }
}
app()

const locateFile = ( nameOfFile ) => {
        const valueSplitter = nameOfFile.split('.')
        const typeOfValue = valueSplitter[valueSplitter.length - 1]
        const content = fs.readFileSync(nameOfFile)
    
        const fileName = nameOfFile.split("." + typeOfValue)[0].toString()
    
        return{
            content,
            typeOfValue,
            fileName
        }
}

const writeEncryptedFile = ( data ) => {
    fs.writeFileSync(data.fileName + ".ecp", data.typeOfValue + ":" + data.iv + ":" + data.value)
    fs.rmSync(data.fileName + "." + data.typeOfValue)
}
const encrypt = ( value, secret ) => {

    const hash = cryptoJs.scryptSync(secret, 'salt', 32);

    try {
        const fileData = locateFile(value);
    }catch(err){
        if (err.code === 'ENOENT') {
            console.error("\x1b[33m\x1b[41m", 'File not found!');
            console.log("\x1b[0m")
            return
        } 
        
        throw err;
        
    }
    const fileData = locateFile(value);
    const iv = Buffer.from(cryptoJs.randomBytes(16));
    const cipher = cryptoJs.createCipheriv('aes-256-cbc', hash, iv);
    let encrypted = cipher.update(fileData.content)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    const finalReturn = {
        iv: iv.toString("hex"),
        value: encrypted.toString("hex"),
        typeOfValue: fileData.typeOfValue,
        fileName: fileData.fileName
    }
    writeEncryptedFile(finalReturn)
    return finalReturn
}

const locateEncryptedFile = ( nameOfFile ) => {
    const valueSplitter = nameOfFile.split('.')
    const typeOfEncryptedFile = valueSplitter[valueSplitter.length - 1]
    if(typeOfEncryptedFile !== "ecp"){
        return {
            error: true,
            msg: "Error: wrong file type!!!"
        }
    }
    const encryptedContent = fs.readFileSync(nameOfFile, 'utf8')
    
    const allContent = encryptedContent.split(":")

    if(allContent.length !== 3){
        return {
            error: true,
            msg: "Error: file is misformatted!!!"
        }
    }

    const typeOfValue = allContent[0]
    const iv = allContent[1]
    const content = allContent[2]
    const fileName = nameOfFile.split("." + typeOfValue)[0].toString()

    return{
        error: false,
        content,
        fileName,
        typeOfValue,
        iv
    }
}

const writeDencryptedFile = ( data ) => {
    const fileName = data.fileName.split("ecp")[0]
    fs.writeFileSync(fileName+ data.typeOfValue, data.value)
}

const decrypt = (fileName, secret) => {

    const hash = cryptoJs.scryptSync(secret, 'salt', 32);

    try {
        const value = locateFile(fileName);
    }catch(err){
        if (err.code === 'ENOENT') {
            console.error("\x1b[33m\x1b[41m", 'File not found!');
            console.log("\x1b[0m")
            return
        }

        throw err;
        
    }
    const value = locateEncryptedFile(fileName)
    if(value.error){
        return value.msg
    }
    const ivBuffer = Buffer.from(value.iv, 'hex')
    
    const decipher = cryptoJs.createDecipheriv('aes-256-cbc', hash, ivBuffer)
    try {
        let content = decipher.update(Buffer.from(value.content, 'hex'))
        content = Buffer.concat([content, decipher.final()])
        const finalReturn = {
            value: content,
            typeOfValue: value.typeOfValue,
            fileName: value.fileName
        }
        writeDencryptedFile(finalReturn)
        return "OK"
    }catch(err){
        if(err.code === 'ERR_OSSL_EVP_BAD_DECRYPT'){
            console.error("\x1b[33m\x1b[41m", 'Wrong secret phrase!!!');
            console.log("\x1b[0m")
            return
        }
            
        throw err;
        
    }

}

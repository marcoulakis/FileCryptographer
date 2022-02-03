import cryptoJs from "crypto";
import fs  from "fs";
const secret = "123456123456123456123456123456123456123456123456123456123456123456123456123456";

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
const encrypt = ( value ) => {
    const fileData = locateFile(value);
    const iv = Buffer.from(cryptoJs.randomBytes(16));
    const cipher = cryptoJs.createCipher('aes-256-cbc', Buffer.from(secret), iv);
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
    const value = locateEncryptedFile(fileName)
    if(value.error){
        return value.msg
    }
    const ivBuffer = Buffer.from(value.iv, 'hex')
    const decipher = cryptoJs.createDecipher('aes-256-cbc', Buffer.from(secret), ivBuffer)
    let content = decipher.update(Buffer.from(value.content, 'hex'))
    content = Buffer.concat([content, decipher.final()])
    const finalReturn = {
        value: content,
        typeOfValue: value.typeOfValue,
        fileName: value.fileName
    }
    writeDencryptedFile(finalReturn)
    return "OK"
}

// const encrypted = encrypt("test.txt")

// console.log(decrypt("test.ecp", secret))
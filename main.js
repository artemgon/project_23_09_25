class Cipher {
    constructor() {
        this.messages = [];
    }

    addMessage(msg) {
        if (msg && msg.trim() !== '') {
            this.messages.push(msg.trim());
            return true;
        }
        return false;
    }

    encodeText(text, key) {
        return this.shiftText(text, key);
    }

    decodeText(text, key) {
        return this.shiftText(text, -key);
    }

    shiftText(text, key) {
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const code = char.charCodeAt(0);
            
            if (code >= 1040 && code <= 1071) {
                const base = 1040;
                const shifted = ((code - base + key) % 33 + 33) % 33 + base;
                result += String.fromCharCode(shifted);
            }
            else if (code >= 1072 && code <= 1103) {
                const base = 1072;
                const shifted = ((code - base + key) % 33 + 33) % 33 + base;
                result += String.fromCharCode(shifted);
            }
            else if (code >= 65 && code <= 90) {
                const base = 65;
                const shifted = ((code - base + key) % 26 + 26) % 26 + base;
                result += String.fromCharCode(shifted);
            }
            else if (code >= 97 && code <= 122) {
                const base = 97;
                const shifted = ((code - base + key) % 26 + 26) % 26 + base;
                result += String.fromCharCode(shifted);
            }
            else {
                result += char;
            }
        }
        
        return result;
    }

    encodeAll(key) {
        this.messages = this.messages.map(msg => this.encodeText(msg, key));
    }

    decodeAll(key) {
        this.messages = this.messages.map(msg => this.decodeText(msg, key));
    }

    clearAll() {
        this.messages = [];
    }

    getMessageCount() {
        return this.messages.length;
    }
}

const cipher = new Cipher();

function addMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;
    
    if (cipher.addMessage(message)) {
        input.value = '';
        updateMessagesList();
        logToConsole(`Added message: "${message}"`);
    } else {
        logToConsole('Error: message cannot be empty');
    }
}

function encodeAll() {
    const key = parseInt(document.getElementById('keyInput').value) || 3;
    
    if (cipher.getMessageCount() === 0) {
        logToConsole('No messages to encode');
        return;
    }
    
    logToConsole(`Encoding all messages with key ${key}...`);
    logToConsole('Before encoding: ' + JSON.stringify(cipher.messages));
    
    cipher.encodeAll(key);
    
    logToConsole('After encoding: ' + JSON.stringify(cipher.messages));
    updateMessagesList();
}

function decodeAll() {
    const key = parseInt(document.getElementById('keyInput').value) || 3;
    
    if (cipher.getMessageCount() === 0) {
        logToConsole('No messages to decode');
        return;
    }
    
    logToConsole(`Decoding all messages with key ${key}...`);
    logToConsole('Before decoding: ' + JSON.stringify(cipher.messages));
    
    cipher.decodeAll(key);
    
    logToConsole('After decoding: ' + JSON.stringify(cipher.messages));
    updateMessagesList();
}

function clearMessages() {
    cipher.clearAll();
    updateMessagesList();
    logToConsole('All messages cleared');
}

function updateMessagesList() {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    cipher.messages.forEach((msg, index) => {
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerHTML = `<strong>Message ${index + 1}:</strong> ${msg}`;
        messagesList.appendChild(messageBox);
    });
    
    if (cipher.getMessageCount() === 0) {
        messagesList.innerHTML = '<div class="message-box"> No messages. Add your first message!</div>';
    }
}

function logToConsole(message) {
    const consoleLog = document.getElementById('consoleLog');
    const timestamp = new Date().toLocaleTimeString();
    consoleLog.textContent = `[${timestamp}] ${message}\n` + consoleLog.textContent;
    console.log(message);
}

function runTests() {
    logToConsole('\n Running tests...');
    
    const testCipher = new Cipher();
    
    testCipher.addMessage("ABC");
    testCipher.encodeAll(1);
    const test1 = testCipher.messages[0] === "BCD";
    logToConsole(`Test 1: ${test1 ? 'Passed' : 'Failed'}`);
    
    testCipher.clearAll();
    testCipher.addMessage("Z");
    testCipher.encodeAll(1);
    const test2 = testCipher.messages[0] === "A";
    logToConsole(`Test 2: ${test2 ? 'Passed' : 'Failed'}`);
    
    testCipher.decodeAll(1);
    const test3 = testCipher.messages[0] === "Z";
    logToConsole(`Test 3: ${test3 ? 'Passed' : 'Failed'}`);
    
    testCipher.clearAll();
    testCipher.addMessage("Hello! 123");
    testCipher.encodeAll(3);
    testCipher.decodeAll(3);
    const test4 = testCipher.messages[0] === "Hello! 123";
    logToConsole(`Test 4: ${test4 ? 'Passed' : 'Failed'}`);
}

function initApp() {
    document.getElementById('addMessageBtn').addEventListener('click', addMessage);
    document.getElementById('encodeBtn').addEventListener('click', encodeAll);
    document.getElementById('decodeBtn').addEventListener('click', decodeAll);
    document.getElementById('clearBtn').addEventListener('click', clearMessages);
    
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMessage();
        }
    });
    
    const exampleMessages = [
        "Hello, how are you?",
        "Secret message",
        "Hello World!",
        "Test message 123!",
        "Another example"
    ];
    
    exampleMessages.forEach(msg => cipher.addMessage(msg));
    updateMessagesList();
    
    logToConsole('Secret cipher ready to work!');
    logToConsole(`Loaded ${cipher.getMessageCount()} test messages`);
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            runTests();
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);
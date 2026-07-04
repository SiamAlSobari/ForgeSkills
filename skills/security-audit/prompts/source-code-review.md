# Source Code Review Prompt

Scan source code for vulnerability patterns.

## SQL Injection

### Patterns

```javascript
// String concatenation in queries
`SELECT * FROM users WHERE id = ${userId}`
"SELECT * FROM users WHERE id = " + userId
`SELECT * FROM users WHERE name = '${name}'`

// Raw query execution
db.raw("SELECT * FROM users WHERE id = " + id)
connection.execute("SELECT * FROM users WHERE id = " + id)
```

### Safe Patterns (exclude)

```javascript
// Parameterized queries
db.query("SELECT * FROM users WHERE id = ?", [userId])
db.query("SELECT * FROM users WHERE id = $1", [userId])
```

## Cross-Site Scripting (XSS)

### Patterns

```javascript
// Direct DOM manipulation
element.innerHTML = userInput
element.outerHTML = userInput
document.write(userInput)

// React dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Vue v-html
<div v-html="userInput"></div>

// Template literal injection
`${userInput}`
```

## Cross-Site Request Forgery (CSRF)

### Patterns

- Forms without CSRF tokens
- State-changing GET requests
- Missing `SameSite` cookie attribute

## Server-Side Request Forgery (SSRF)

### Patterns

```javascript
// User-controlled URLs
fetch(req.query.url)
axios.get(req.body.url)
new URL(req.params.url)

// Redirect to user-controlled URL
res.redirect(req.query.next)
res.redirect(req.body.returnUrl)
```

## Remote Code Execution (RCE)

### Patterns

```javascript
// eval with user input
eval(userInput)
new Function(userInput)
setTimeout(userInput, 0)
setInterval(userInput, 0)

// Shell execution
exec(userInput)
execSync(userInput)
spawn('sh', ['-c', userInput])
child_process.exec(userInput)

// Python
os.system(user_input)
subprocess.call(user_input, shell=True)
eval(user_input)
```

## Command Injection

### Patterns

```javascript
// Shell commands with user input
exec(`ls ${userInput}`)
execSync(`grep ${pattern} ${file}`)
spawn('find', [userInput])

// Python
os.popen(f"cat {user_input}")
subprocess.run(f"ls {user_input}", shell=True)
```

## Path Traversal

### Patterns

```javascript
// User-controlled file paths
fs.readFile(req.params.file)
fs.readFile(req.query.path)
path.join(baseDir, userInput)
res.sendFile(req.query.file)

// Directory traversal
"../../../etc/passwd"
"..\\..\\windows\\system32"
```

## Unsafe Deserialization

### Patterns

```javascript
// Node.js
JSON.parse(userInput)  // Generally safe, but check usage
eval("(" + userInput + ")")  // Dangerous

// Python
pickle.loads(user_input)
yaml.load(user_input)  // Without SafeLoader

// Java
ObjectInputStream.readObject()
```

## Output

For each finding:
```
Finding: [Vulnerability Type]
Severity: [Critical|High|Medium]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Recommendation: [fix]
```

# montanature-site

Node.js + HTML5 + CSS3 + Bootstrap + MongoDB Atlas  
## 🌿 Full-Stack Application

<img width="1894" height="904" alt="image" src="https://github.com/user-attachments/assets/7618d1a6-401b-4b2d-8923-dae62020b972" />

<img width="1916" height="907" alt="image" src="https://github.com/user-attachments/assets/9b968f37-db21-47e1-86f4-9a51d3be1680" />

### Admin Page

<img width="1894" height="907" alt="image" src="https://github.com/user-attachments/assets/a42dc909-7b20-4949-954f-bbd813ed99d8" />

<img width="1887" height="904" alt="image" src="https://github.com/user-attachments/assets/81b6dd4a-2e85-491e-aa3d-238795af384e" />

---

## 🛠 Server / Deployment Commands

Below are the commands used to update, manage, and monitor the MontaNature site on the server.

### 📂 1. Go to the Project Directory
Moves into your project folder.
```bash
cd ~/sites/montanature-site

⬇️ 2. Pull Latest Changes from GitHub

Fetches and updates your project with the newest code from the main branch.

git pull origin main

📦 3. Install/Update Dependencies

Installs all required Node.js packages from package.json.

npm install

🚀 PM2 Process Management

PM2 is used to run the Node.js app in the background.

🔄 4. Restart the Application

Restarts your running Node app after code updates.

npx pm2 restart montanature

⛔ 5. Stop the Application

Stops the MontaNature process.

npx pm2 stop montanature

📄 6. View Application Logs

Shows real-time console output (errors, requests, etc.).

npx pm2 logs montanature

📋 7. List All PM2 Processes

Displays all running apps managed by PM2.

npx pm2 list


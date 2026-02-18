# Deployment Guide

## ✅ Code Successfully Pushed to GitHub!
Repository: https://github.com/vishalkrishnans2024lcse-sketch/subassign.git

---

## 🚀 Deploy to Vercel (Recommended)

### Method 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `vishalkrishnans2024lcse-sketch/subassign`
5. Configure:
   - Framework Preset: **Create React App**
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Add Environment Variable:
   - Name: `REACT_APP_API_URL`
   - Value: `http://localhost:5000/api` (or your backend URL)
7. Click "Deploy"

### Method 2: Vercel CLI
```bash
npm install -g vercel
cd assignment-portal-frontend
vercel login
vercel
```

---

## 🌐 Deploy to Netlify

### Method 1: Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Choose GitHub and select `subassign` repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `http://localhost:5000/api`
7. Click "Deploy site"

### Method 2: Netlify CLI
```bash
npm install -g netlify-cli
cd assignment-portal-frontend
netlify login
netlify init
netlify deploy --prod
```

---

## 📝 Important Notes

### Environment Variables
For production, update `.env`:
```
REACT_APP_API_URL=https://your-backend-api.com/api
REACT_APP_USE_MOCK=false
```

### Build Command
```bash
npm run build
```

### Test Locally
```bash
npm start
```

---

## 🎯 Live URLs (After Deployment)

- **Vercel**: `https://subassign.vercel.app`
- **Netlify**: `https://subassign.netlify.app`

---

## 🔑 Test Credentials

### Admin (Teacher)
- Email: `admin@test.com`
- Password: `admin123`

### Student
- Email: `student@test.com`
- Password: `student123`

---

## ✨ Features Deployed

✅ Glassmorphism UI with blue-green gradient
✅ Interactive buttons with ripple effects
✅ Role-based authentication
✅ Assignment submission with file upload
✅ Admin dashboard with statistics
✅ Student dashboard
✅ Responsive design
✅ Mock API for testing

---

## 🛠️ Troubleshooting

### Build Fails
- Check `package.json` dependencies
- Run `npm install` before deploying

### Blank Page
- Check browser console for errors
- Verify environment variables

### API Not Working
- Set `REACT_APP_USE_MOCK=true` for testing
- Update API URL in production

---

## 📞 Support
For issues, check the GitHub repository or deployment platform logs.
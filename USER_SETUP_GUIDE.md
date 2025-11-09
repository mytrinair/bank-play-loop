# 🎓 BankDojo Jr. User Account Setup Guide

## 🚀 Complete Auth0 Integration with Role Selection

Your Auth0 integration now includes:
- ✅ Self-registration capability
- ✅ Role selection (Student/Teacher)
- ✅ Automatic dashboard routing
- ✅ Protected routes

## 📝 Auth0 Configuration Steps

### Step 1: Enable User Registration
1. **Go to Auth0 Dashboard** → Authentication → Database
2. **Select "Username-Password-Authentication"**
3. **Settings Tab**:
   - ✅ **Disable Sign Ups** = OFF (to allow new registrations)
   - ✅ **Requires Username** = OFF (email-based login)
4. **Save Changes**

### Step 2: Update Application URLs
1. **Go to Applications** → Your BankDojo Jr. App
2. **Settings Tab**, add these URLs:

   **Allowed Callback URLs:**
   ```
   http://localhost:8080/callback,http://localhost:5173/callback
   ```

   **Allowed Web Origins:**
   ```
   http://localhost:8080,http://localhost:5173
   ```

   **Allowed Logout URLs:**
   ```
   http://localhost:8080,http://localhost:5173
   ```

3. **Save Changes**

## 🧪 Testing the Complete Flow

### New User Registration:
1. **Visit**: http://localhost:8080/
2. **Click**: "Student Login" or "Teacher Login"
3. **On Auth0 page**: Click "Sign up"
4. **Create account** with email/password
5. **After login**: You'll be redirected to role selection
6. **Choose role**: Student or Teacher
7. **Automatic redirect** to appropriate dashboard

### Existing User Login:
1. **Visit**: http://localhost:8080/
2. **Click**: Login button
3. **Enter credentials**
4. **Automatic redirect** to your dashboard (based on saved role)

## 👥 Quick Test Accounts

You can create test accounts like:

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `TestPass123!`

**Student Account:**
- Email: `student@test.com`
- Password: `TestPass123!`

## 🔄 User Flow Diagram

```
User visits app
     ↓
Clicks Login → Auth0 Universal Login
     ↓
New User? → Sign Up → Login
     ↓
Role Selected? 
  No → Role Selection Page (/setup)
  Yes → Dashboard (Student/Teacher)
```

## 🛠️ Features Implemented

### 1. **Smart Role Detection**
- Checks Auth0 metadata first
- Falls back to localStorage for speed
- Prompts for role selection if none found

### 2. **Protected Routes**
- Students can only access `/student`
- Teachers can only access `/teacher`
- Automatic role-based redirects

### 3. **Seamless UX**
- Loading states during authentication
- Proper error handling
- Role persistence across sessions

### 4. **Security**
- JWT token validation
- Role-based API access
- Secure logout with cleanup

## 🎯 What Happens Next

After users select their role:
1. **Role stored** in localStorage for fast access
2. **Redirected** to appropriate dashboard
3. **API calls** automatically include auth tokens
4. **Protected routes** enforce role-based access

## 🚨 Troubleshooting

**"Callback URL mismatch"** → Update Auth0 app settings
**"Service not found"** → API audience issue (already fixed)
**Infinite redirect** → Check role selection logic
**403 errors** → Role permissions issue

## 🎉 You're Ready!

Your BankDojo Jr. app now has:
- ✅ Complete Auth0 integration
- ✅ User registration & role selection  
- ✅ Protected dashboards
- ✅ Secure API authentication

Test it out by visiting http://localhost:8080/ and creating new accounts! 🚀
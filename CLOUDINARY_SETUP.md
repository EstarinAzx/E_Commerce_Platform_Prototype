# Cloudinary Setup Instructions

## Step 1: Add Environment Variables

Open `server/.env` and add these lines:

```env
CLOUDINARY_CLOUD_NAME=dl49kvppz
CLOUDINARY_API_KEY=384975989669137
CLOUDINARY_API_SECRET=YOUR_SECRET_HERE
```

**Important**: Replace `YOUR_SECRET_HERE` with your actual API Secret from the Cloudinary dashboard (click the eye icon 👁️ to reveal it).

## Step 2: Restart Backend Server

After adding the credentials, restart your backend:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 3: Test Image Upload

1. Go to Admin Dashboard → Products
2. Click "Add Product"
3. Fill in product details
4. Click "Choose File" for Product Image
5. Select an image from your computer
6. Wait for upload (shows "Uploading...")
7. Image preview appears
8. Click "Create Product"

✅ **Done!** Your images will now be stored on Cloudinary and URLs saved in your database.

## Features

- ✅ File upload button in add/edit forms
- ✅ Image preview before saving
- ✅ Upload progress indicator
- ✅ Images stored on Cloudinary CDN
- ✅ Auto-optimized and fast delivery
- ✅ 5MB file size limit

## Notes

- Free tier: 25GB storage, 25GB bandwidth/month
- Images uploaded to `products` folder in Cloudinary
- URLs are permanent and CDN-optimized

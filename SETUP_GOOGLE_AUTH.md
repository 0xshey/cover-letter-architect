# Google Cloud & NextAuth Setup Instructions

To complete the integration, you must configure a Google Cloud Project.

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "Cover Letter App").
3. Navigate to **APIs & Services > Library**.
4. Search for and enable **Generative Language API**. (This is critical for Gemini).

## 2. Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** (or Internal if you are a Workspace user).
3. Fill in the App Name and User Support Email.
4. **Scopes**: Add the following scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
   - **Manually add**: `https://www.googleapis.com/auth/cloud-platform` (This scope allows calling Google Cloud APIs including Gemini).

## 3. Create Credentials

1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > OAuth client ID**.
3. Application Type: **Web application**.
4. Name: "Next.js App".
5. **Authorized JavaScript origins**: `http://localhost:3000`
   > **Note**: Do NOT add a path or trailing slash here. Just the domain and port.
6. **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
   > **Note**: This is a different section below "Origins". It requires the full path.

## 4. Environment Variables

Copy the **Client ID** and **Client Secret** and add them to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=generate-a-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

(You can generate a random secret with `openssl rand -base64 32`)

## 5. Run the App

Restart your server (`npm run dev`) and click **Sign In with Google** in the Settings dialog.

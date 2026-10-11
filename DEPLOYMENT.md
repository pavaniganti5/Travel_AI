# TravelAI deployment

This project uses Vercel for the Vite frontend and Render for the FastAPI backend. MongoDB Atlas is needed for persistent trip storage; the local JSON fallback is not suitable for a hosted service with an ephemeral filesystem.

## 1. Rotate exposed credentials

Before deploying, revoke and replace any Gemini or Murf API keys that were previously placed in `backend/.env.example`. Keep replacement keys in the Render environment only, never in source control or Vercel.

## 2. Deploy the API to Render

1. Push the project to a Git provider that Render can access.
2. In Render, create a **Blueprint** from the repository and select the root `render.yaml`.
3. When prompted, set `MONGODB_URI` to a MongoDB Atlas connection string. URL-encode special characters in the database username or password.
4. Create the service and wait for its `/api/health` check to pass. The API URL will be similar to `https://travelai-api.onrender.com`.
5. In the service's **Environment** settings, add any optional `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `MURF_API_KEY` values. Set `AI_PROVIDER` to `gemini` or `openai` if you want to select one explicitly.

## 3. Deploy the frontend to Vercel

1. Import the same repository into Vercel.
2. Set the project **Root Directory** to `frontend`.
3. Add the environment variable `VITE_API_BASE_URL` with the API URL followed by `/api`, for example `https://travelai-api.onrender.com/api`.
4. Deploy and note the Vercel production domain, such as `https://travelai-your-name.vercel.app`.

## 4. Allow the Vercel domain in API CORS

In Render's API service **Environment** settings, set `CORS_ORIGINS` to a JSON array containing the exact Vercel origin, with no path or trailing slash:

```text
["https://travelai-your-name.vercel.app"]
```

If you use a custom domain, include that origin too. Save the environment change and let Render redeploy. Then trigger a new Vercel deployment if you changed `VITE_API_BASE_URL`.

## Notes

- Set environment variables in the hosting dashboards; do not commit `.env` files or credentials.
- Render's free web service may sleep when idle, so its first request can take longer.
- After deployment, verify the Render health endpoint at `/api/health`, then open the Vercel site and try generating and saving a trip.

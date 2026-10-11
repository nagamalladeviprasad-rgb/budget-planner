# Budget Planner

Full-stack budget planner built with React, Express, and MongoDB.

## Deploy on Render

The repository includes a `render.yaml` Blueprint for the frontend and API.

1. Push this repository to GitHub.
2. In Render, choose **New + → Blueprint** and select this repository.
3. Provide the MongoDB connection string when prompted for `MONGO_URI`.
4. Allow the Render API service's outbound IPs in MongoDB Atlas Network Access, then deploy.

Render generates `JWT_SECRET`, wires the API URL into the frontend build, and checks the API at `/health`. Keep database credentials out of Git. The free API service may sleep when idle and take a short time to wake up.

## Local Development

Install dependencies in `backend` and `frontend-react`, then create `backend/.env` with `MONGO_URI` and `JWT_SECRET`. Start the API with `npm run dev` from `backend` and the frontend with `npm run dev` from `frontend-react`.

For a production frontend build, set `VITE_API_URL` to the public API URL before running `npm run build`. GitHub Pages hosts only the frontend; choose the `gh-pages` branch in the repository's Pages settings if using that option.

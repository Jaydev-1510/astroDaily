import type { APIRoute } from "astro";
import { buildInfo } from "@/data/generateBuildInfo";

export const GET: APIRoute = () => {
  const vercel = {
    commitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME ?? null,
    vercelENV: process.env.VERCEL_ENV ?? null,
    vercelCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    vercelCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null,
    vercelBranch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  };

  const data = { ...buildInfo, ...vercel };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

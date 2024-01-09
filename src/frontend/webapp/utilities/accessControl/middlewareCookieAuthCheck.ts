import { NextRequest } from "next/server";
import { UserRole } from "../../../../backend/api/src/bll/user/types";
import { edenFetch } from "@elysiajs/eden";
import { Api } from "api/src/index";

export const middlewareCookieAuthCheck = async (
  req: NextRequest
): Promise<UserRole> => {
  try {
    const authToken = req.cookies.get("gefortecanAuth");
    if (!authToken) {
      throw 401;
    }
    const fetch = edenFetch<Api>("http://localhost:3001/api");
    const { data } = await fetch("/account/auth", {
      credentials: "include",
      headers: {
        cookie: `gefortecanAuth=${authToken.value}`,
      },
    });
    if (!data?.role) {
      throw 401;
    }
    return data.role;
  } catch (e) {
    console.log(e);
    throw 401;
  }
};
